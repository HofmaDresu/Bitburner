import {getStartableServers, getBestServersForHacking} from "/helpers.js"

/** @param {NS} ns */
export async function main(ns) {
	ns.run('run-money-maker.js');
	ns.run('purchase-server.js')
	ns.run('/stocks/stock-watcher.js');
	ns.run('/stocks/play-the-market.js');
	var myHackingLevel = ns.getHackingLevel();
	var startableServers = getStartableServers(ns, "home", myHackingLevel);
	var bestServerForHacking = getBestServersForHacking(ns, startableServers, myHackingLevel)[0];

	var startServerRam = ns.getScriptRam('start-server.js');
	var availableMemory = ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - (startServerRam * 2);
	var moneyMakerRam = ns.getScriptRam('money-maker.js');
	var maxThreads = Math.floor(availableMemory / moneyMakerRam);
	ns.run('money-maker.js', maxThreads, bestServerForHacking);	
}
