import {calculateThreadsForGrowToTargetPercent, calculateThreadsForHackToTargetPercent, calculateThreadsToWeakenToMin, MAX_SINGLE_PROGRAM_RAM} from "/helpers.js";
import {shouldLowerValueForStock, shouldRaiseValueForStock, getStockForServer} from "/stocks/helpers.js";

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

	const hostname = ns.getServer().hostname;
	var availableMemory = Math.min(ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname), MAX_SINGLE_PROGRAM_RAM);

	const growScript = '/money-maker/grow-server.js';
	var growRam = ns.getScriptRam(growScript);
	var maxGrowThreads = Math.max(Math.floor(availableMemory / growRam), 1);
	const calcGrowTime = (targetServer, player) => ns.formulas.hacking.growTime(targetServer, player);
	const calcGrowThreads = () => calculateThreadsForGrowToTargetPercent(ns, server, 1, maxGrowThreads);
    const growShouldManipulateMarket = (targetHostname) => shouldRaiseValueForStock(ns, getStockForServer(targetHostname));
	await actionServer(ns, server, growScript, calcGrowTime, calcGrowThreads, growShouldManipulateMarket)

	const hackScript = '/money-maker/hack-server.js';
	var hackRam = ns.getScriptRam(hackScript);
	var maxHackThreads = Math.max(Math.floor(availableMemory / hackRam), 1);
	const calcHackTime = (targetServer, player) => ns.formulas.hacking.hackTime(targetServer, player);
	const calcHackThreads = () => calculateThreadsForHackToTargetPercent(ns, server, .5, maxHackThreads);
    const hackShouldManipulateMarket = (targetHostname) => shouldLowerValueForStock(ns, getStockForServer(targetHostname));
	await actionServer(ns, server, hackScript, calcHackTime, calcHackThreads, hackShouldManipulateMarket)
}

/** @param {NS} ns */
async function actionServer(ns, targetServerHostname, script, calcActionTime, calcActionThreads, shouldManipulateMarket) {
	const hostname = ns.getServer().hostname;
	
	let threadsNeededForAction = calcActionThreads();
	while (threadsNeededForAction > 0) {
		const actionTime = await weakenToMin(ns, targetServerHostname, hostname, script, threadsNeededForAction, calcActionTime);
		ns.run(script, threadsNeededForAction, targetServerHostname, threadsNeededForAction, shouldManipulateMarket(targetServerHostname));
		await ns.sleep(actionTime);
		threadsNeededForAction = calcActionThreads();
	}
}

/** @param {NS} ns */
async function weakenToMin(ns, targetServerHostname, hostname, script, threadsNeededForAction, calcActionTime) {
	let player = ns.getPlayer();
	const availableMemory = (ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname));
	const actionRam = ns.getScriptRam(script);
	const weakenRam = ns.getScriptRam('/money-maker/weaken-server.js');
	const maxWeakenThreads = Math.max(Math.floor(availableMemory / weakenRam), 1);
	const threadsNeededToWeaken = await calculateThreadsToWeakenToMin(ns, targetServerHostname, maxWeakenThreads);
	const numberOfWeakensNeeded = Math.ceil((threadsNeededToWeaken * 1.0) / maxWeakenThreads);
	let targetServer = ns.getServer(targetServerHostname);
	let actionTime = calcActionTime(targetServer, player);

	for (let i = 0; i < numberOfWeakensNeeded; i++) {
		const timeToWeaken = ns.formulas.hacking.weakenTime(targetServer, player) + PADDING_TIME;
		const timeToWeakenLastRun = (actionRam * threadsNeededForAction) + (weakenRam * threadsNeededToWeaken) < availableMemory * .9 ? timeToWeaken - actionTime + PADDING_TIME : timeToWeaken;
		ns.run("/money-maker/weaken-server.js", threadsNeededToWeaken, targetServerHostname);
		const sleepTime = i < numberOfWeakensNeeded - 1 ? timeToWeaken : timeToWeakenLastRun;
		await ns.sleep(Math.max(sleepTime, 10));
		targetServer = ns.getServer(targetServerHostname);
		player = ns.getPlayer();
		actionTime = calcActionTime(targetServer, player);
	}

	return actionTime + PADDING_TIME;
}
