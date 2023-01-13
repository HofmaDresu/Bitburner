/** @param {NS} ns */
export async function main(ns) {

	while (true) {
		const server = ns.getServer(); //TODO: this is getting home because that's where this script runs. Can we get "current connected server"? Do we need to run multiple threads?
		var availableMemory = (ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) * .5;
		const manualHackRam = ns.getScriptRam('/experience/manual-hack-self.js');
		const hackThreads = Math.floor(availableMemory / manualHackRam);
		const player = ns.getPlayer();
		const timeToHack = ns.formulas.hacking.hackTime(server, player); 
		const timeToWeaken = ns.formulas.hacking.weakenTime(server, player) ;
		if (hackThreads > 0) {
			for (let i = 0; i < hackThreads; i++) {
				ns.run("/experience/manual-hack-self.js", 1);
			}
		}
		await ns.sleep(timeToHack + timeToWeaken + 50);
	}
}