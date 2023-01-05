import {calculateThreadsForGrowToTargetPercent, calculateThreadsForHackToTargetPercent, calculateThreadsToWeakenToMin} from "/helpers.js";

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
		await advancedMakeMoneyFromServer(ns, server);
		await ns.sleep(50);
	}
}

/** @param {NS} ns */
async function advancedMakeMoneyFromServer(ns, server) {
	const player = ns.getPlayer();
	const targetServer = ns.getServer(server);

	const hostname = ns.getServer().hostname;
	var availableMemory = (ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname));

	const growScript = '/money-maker/grow-server.js';
	var growRam = ns.getScriptRam(growScript);
	var maxGrowThreads = Math.max(Math.floor(availableMemory / growRam), 1);
	const calcGrowTime = () => ns.formulas.hacking.growTime(targetServer, player);
	const calcGrowThreads = () => calculateThreadsForGrowToTargetPercent(ns, server, 1, maxGrowThreads);
	await actionServer(ns, player, targetServer, growScript, calcGrowTime, calcGrowThreads)

	const hackScript = '/money-maker/hack-server.js';
	var hackRam = ns.getScriptRam(hackScript);
	var maxHackThreads = Math.max(Math.floor(availableMemory / hackRam), 1);
	const calcHackTime = () => ns.formulas.hacking.hackTime(targetServer, player);
	const calcHackThreads = () => calculateThreadsForHackToTargetPercent(ns, server, .5, maxHackThreads);
	await actionServer(ns, player, targetServer, hackScript, calcHackTime, calcHackThreads)
}

/** @param {NS} ns */
async function actionServer(ns, player, targetServer, script, calcActionTime, calcActionThreads) {
	const hostname = ns.getServer().hostname;
	
	let threadsNeededForAction = calcActionThreads();
	while (threadsNeededForAction > 0) {
		const actionTime = await weakenToMin(ns, targetServer, player, hostname, script, threadsNeededForAction, calcActionTime);
		ns.run(script, threadsNeededForAction, targetServer.hostname, threadsNeededForAction);
		await ns.sleep(actionTime);
		threadsNeededForAction = calcActionThreads();
	}
}

/** @param {NS} ns */
async function weakenToMin(ns, targetServer, player, hostname, script, threadsNeededForAction, calcActionTime) {
	const availableMemory = (ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname));
	const actionRam = ns.getScriptRam(script);
	const weakenRam = ns.getScriptRam('/money-maker/weaken-server.js');
	const maxWeakenThreads = Math.max(Math.floor(availableMemory / weakenRam), 1);
	const threadsNeededToWeaken = await calculateThreadsToWeakenToMin(ns, targetServer.hostname, maxWeakenThreads);
	const numberOfWeakensNeeded = Math.ceil((threadsNeededToWeaken * 1.0) / maxWeakenThreads);
	let actionTime = calcActionTime();

	for (let i = 0; i < numberOfWeakensNeeded; i++) {
		const timeToWeaken = ns.formulas.hacking.weakenTime(targetServer, player) + PADDING_TIME;
		const timeToWeakenLastRun = (actionRam * threadsNeededForAction) + (weakenRam * threadsNeededToWeaken) < availableMemory * .9 ? timeToWeaken - actionTime + PADDING_TIME : timeToWeaken;
		ns.run("/money-maker/weaken-server.js", threadsNeededToWeaken, targetServer.hostname);
		const sleepTime = i < numberOfWeakensNeeded - 1 ? timeToWeaken : timeToWeakenLastRun;
		await ns.sleep(Math.max(sleepTime, 10));
		actionTime = calcActionTime();
	}

	return actionTime + PADDING_TIME;
}
