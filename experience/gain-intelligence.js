/** @param {NS} ns */
export async function main(ns) {
	const minMemory = ns.getServerMaxRam("home") * .1
	let availableMemory = Math.max(ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - minMemory, 0);
	const manualHackRam = ns.getScriptRam('/experience/manual-hack-self.js');
	const hackThreads = Math.floor(availableMemory / manualHackRam);
	for(let i = 0; i < hackThreads; i++) {
		ns.run("/experience/manual-hack-self.js", 1);
	}
}