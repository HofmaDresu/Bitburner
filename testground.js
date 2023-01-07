//import * as helpers from "helpers.js"

/** @param {NS} ns */
export async function main(ns) {
	ns.tprint(ns.getBitNodeMultipliers())
}

/** @param {NS} ns */
/*
async function hackOnHomeServer(ns) {
		var myHackingLevel = ns.getHackingLevel();
	var startableServers = await helpers.getStartableServers(ns, "home", myHackingLevel);
	var bestServerForHacking = helpers.getBestServersForHacking(ns, startableServers, myHackingLevel)[0];

	var startServerRam = ns.getScriptRam('start-server.js');
	// SUPER inefficient
	var availableMemory = (ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) * .8;

	var moneyMakerRam = ns.getScriptRam('money-maker.js');
	var maxThreads = Math.max(Math.floor(availableMemory / moneyMakerRam), 1);
	 ns.run('money-maker.js', maxThreads, bestServerForHacking);
}
*/