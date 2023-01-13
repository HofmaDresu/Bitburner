/** @param {NS} ns */
export async function main(ns) {

	while (true) {
		var availableMemory = (ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) * .8;
		const manualHackRam = ns.getScriptRam('/experience/manual-hack-self.js');
		const hackThreads = Math.floor(availableMemory / manualHackRam);
		if (hackThreads > 0) {
			ns.run("/experience/manual-hack-self.js", 1);
		}
		await ns.sleep(1);
	}
}