import * as helpers from "helpers" 


/** @param {NS} ns */
export async function main(ns) {
	ns.tprint(ns.heart.break())
	ns.tprint(ns.getPlayer().numPeopleKilled)


	helpers.FACTIONS.forEach(f => {
		const availableAugments = ns.singularity.getAugmentationsFromFaction(f).filter(f => !ns.singularity.getOwnedAugmentations(true).some(oa => oa === f));
		if (availableAugments.length > 0) {
			ns.tprint(`${f}: ${availableAugments.join(', ')}`);
		}
	})
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