import {getStartableServers, getBestServersForHacking} from "/helpers.js"

/** @param {NS} ns */
export async function main(ns) {
	ns.run('/money-maker/run-money-maker.js');
	ns.run('/upgraders/purchase-server.js');
	ns.run('/upgraders/purchase-programs.js');
	ns.run('/upgraders/upgrade-home-server.js');
	ns.run('/contracts/complete-coding-contracts.js');
	// Not worth it right now, re-enable when we have the right bitnode
	//ns.run('/upgraders/purchase-hacknet-nodes.js') 
	if (ns.getServerMaxRam("home") >= 1024) {
		ns.run('/stocks/stock-watcher.js');
		ns.run('/stocks/activate-purchases.js');
		ns.run('/stocks/play-the-market.js');
		// Always call this last
		ns.run('/stocks/start-manipulating-market.js');
	}

	if (!ns.singularity.isBusy()) {
		ns.singularity.universityCourse("Rothman University", "Study Computer Science", true);
	}
}
