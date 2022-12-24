import {getStartableServers, getBestServersForHacking} from "/helpers.js"

/** @param {NS} ns */
export async function main(ns) {
	ns.run('run-money-maker.js');
	ns.run('purchase-server.js');
	ns.run('purchase-programs.js');
	ns.run('upgrade-home-server.js');
	// Not worth it right now, re-enable when we have the right bitnode
	//ns.run('purchase-hacknet-nodes.js') 
	if (ns.getServerMaxRam("home") >= 1024) {
		ns.run('/stocks/stock-watcher.js');
		ns.run('/stocks/activate-purchases.js');
		ns.run('/stocks/play-the-market.js');
		// Always call this last
		ns.run('/stocks/start-manipulating-market.js');
	}
	/*
	await ns.sleep(60000);
	var myHackingLevel = ns.getHackingLevel();
	var startableServers = await getStartableServers(ns, "home", myHackingLevel);
	var bestServerForHacking = getBestServersForHacking(ns, startableServers, myHackingLevel)[0];

	var startServerRam = ns.getScriptRam('start-server.js');
	// SUPER inefficient
	var availableMemory = ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - (startServerRam * startableServers.length);
	var moneyMakerRam = ns.getScriptRam('money-maker.js');
	var maxThreads = Math.max(Math.floor(availableMemory / moneyMakerRam), 1);
	 ns.run('money-maker.js', maxThreads, bestServerForHacking);
	 */
}
