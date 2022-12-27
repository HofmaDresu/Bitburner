import {calculateThreadsForGrowToTargetPercent, calculateThreadsForHackToTargetPercent, calculateThreadsToWeakenToMin} from "/helpers.js";

const PADDING_TIME = 100;

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
		await makeMoneyFromServer(ns, server);
	}
}

async function makeMoneyFromServer(ns, server) {
	// TODO: sleep by min possible amount
	// TODO: make sure we fully grow before we hack
	const player = ns.getPlayer();
	const targetServer = ns.getServer(server);
	const timeToGrow =  ns.formulas.hacking.growTime(targetServer, player) + PADDING_TIME;
	const timeToHack = ns.formulas.hacking.hackTime(targetServer, player) + PADDING_TIME;

	const hostname = ns.getServer().hostname;
	var availableMemory = (ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)) * .9;
	var growRam = ns.getScriptRam('/money-maker/grow-server.js');
	var maxGrowThreads = Math.max(Math.floor(availableMemory / growRam), 1);
	var hackRam = ns.getScriptRam('/money-maker/hack-server.js');
	var maxHackThreads = Math.max(Math.floor(availableMemory / hackRam), 1);

	await weakenToMin(ns, targetServer, player, availableMemory);
	// Send grow if needed
	const threadsNeededToGrow = calculateThreadsForGrowToTargetPercent(ns, server, 1, maxGrowThreads);
	if (threadsNeededToGrow > 0) {
		ns.run("/money-maker/grow-server.js", threadsNeededToGrow, server);
		await ns.sleep(Math.max(timeToGrow, 10));
	}
	await weakenToMin(ns, targetServer, player, availableMemory);
	const threadsNeededToHack = calculateThreadsForHackToTargetPercent(ns, server, .9, maxHackThreads);
	if (threadsNeededToHack > 0) {
		ns.run("/money-maker/hack-server.js", threadsNeededToHack, server);
		await ns.sleep(Math.max(timeToHack, 10));
	}
}

async function weakenToMin(ns, targetServer, player, availableMemory) {
	const timeToWeaken = ns.formulas.hacking.weakenTime(targetServer, player) + PADDING_TIME;
	const weakenRam = ns.getScriptRam('/money-maker/weaken-server.js');
	const maxWeakenThreads = Math.max(Math.floor(availableMemory / weakenRam), 1);
	const threadsNeededToWeaken = await calculateThreadsToWeakenToMin(ns, targetServer.hostname, maxWeakenThreads);
	const numberOfWeakensNeeded = Math.ceil((threadsNeededToWeaken * 1.0) / maxWeakenThreads);

	for (let i = 0; i < numberOfWeakensNeeded; i++) {
		ns.run("/money-maker/weaken-server.js", threadsNeededToWeaken, targetServer.hostname);
		await ns.sleep(Math.max(timeToWeaken, 10));
	}
}
