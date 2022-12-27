import {calculateThreadsForGrowToTargetPercent, calculateThreadsForHackToTargetPercent, calculateThreadsToWeakenToMin, growToTargetPercent, hackToTargetPercent} from "/helpers.js";

const PADDING_TIME = 200;

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("getServerMinSecurityLevel");
	ns.disableLog("getServerSecurityLevel");
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("getServerMaxRam");
	ns.disableLog("getServerUsedRam");
	const server = arguments[0].args[0];
	while(true) {
		if (!ns.fileExists('Formulas.exe', 'home')) {
			await basicMakeMoneyFromServer(ns, server);
		} else {
			await advancedMakeMoneyFromServer(ns, server);
		}
		await ns.sleep(50);
	}
}

async function basicMakeMoneyFromServer(ns, server) {
	while(true) {
		await growToTargetPercent(ns, server, 1, false);
		await hackToTargetPercent(ns, server, .50, false);
	}
}

async function advancedMakeMoneyFromServer(ns, server) {
	const player = ns.getPlayer();
	const targetServer = ns.getServer(server);

	const hostname = ns.getServer().hostname;
	var availableMemory = (ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname));

	const growScript = '/money-maker/grow-server.js';
	var growRam = ns.getScriptRam(growScript);
	var maxGrowThreads = Math.max(Math.floor(availableMemory / growRam), 1);
	const calcGrowTime = () => ns.formulas.hacking.growTime(targetServer, player) + PADDING_TIME;
	const calcGrowThreads = () => calculateThreadsForGrowToTargetPercent(ns, server, 1, maxGrowThreads);
	await actionServer(ns, player, targetServer, growScript, calcGrowTime, calcGrowThreads)

	const hackScript = '/money-maker/hack-server.js';
	var hackRam = ns.getScriptRam(hackScript);
	var maxHackThreads = Math.max(Math.floor(availableMemory / hackRam), 1);
	const calcHackTime = () => ns.formulas.hacking.hackTime(targetServer, player) + PADDING_TIME;
	const calcHackThreads = () => calculateThreadsForHackToTargetPercent(ns, server, .5, maxHackThreads);
	await actionServer(ns, player, targetServer, hackScript, calcHackTime, calcHackThreads)
}

async function actionServer(ns, player, targetServer, script, calcActionTime, calcActionThreads) {
	const hostname = ns.getServer().hostname;
	var availableMemory = (ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname));
	const timeToWeaken = ns.formulas.hacking.weakenTime(targetServer, player) + PADDING_TIME;
	const weakenRam = ns.getScriptRam('/money-maker/weaken-server.js');
	const maxWeakenThreads = Math.max(Math.floor(availableMemory / weakenRam), 1);
	const threadsNeededToWeaken = await calculateThreadsToWeakenToMin(ns, targetServer.hostname, maxWeakenThreads);
	const numberOfWeakensNeeded = Math.ceil((threadsNeededToWeaken * 1.0) / maxWeakenThreads);
	
	let threadsNeededForAction = calcActionThreads();
	while (threadsNeededForAction > 0) {
		let actionTime = calcActionTime();
		let actionRam = ns.getScriptRam(script);
		const timeToWeakenLastRun = (actionRam * threadsNeededForAction) + (weakenRam * threadsNeededToWeaken) < availableMemory * .9 ? timeToWeaken - actionTime + PADDING_TIME : timeToWeaken;
		await weakenToMin(ns, numberOfWeakensNeeded, threadsNeededToWeaken, targetServer.hostname, timeToWeaken, timeToWeakenLastRun)
		ns.run(script, threadsNeededForAction, targetServer.hostname);
		await ns.sleep(actionTime);
		threadsNeededForAction = calcActionThreads();
	}
}

async function weakenToMin(ns, numberOfWeakensNeeded, threadsNeededToWeaken, server, timeToWeaken, timeToWeakenLastRun) {
	for (let i = 0; i < numberOfWeakensNeeded; i++) {
		ns.run("/money-maker/weaken-server.js", threadsNeededToWeaken, server);
		const sleepTime = i < numberOfWeakensNeeded - 1 ? timeToWeaken : timeToWeakenLastRun;
		await ns.sleep(Math.max(sleepTime, 10));
	}
}
