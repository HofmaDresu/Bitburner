// NOTE: Doesn't work. Keeps hacking home. Need some way to connect to a server in scope I guess?


/** @param {NS} ns */
export async function main(ns) {
    const server = ns.getServer();
	const hostname = server.hostname;

	var availableMemory = (ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname));
	const manualHackRam = ns.getScriptRam('/experience/manual-hack-self.js');
	const maxHackThreads = Math.max(Math.floor(availableMemory / manualHackRam), 1);

	while (true) {
		const player = ns.getPlayer();
		const timeToHack = ns.formulas.hacking.hackTime(server, player);
		ns.run("/experience/manual-hack-self.js", maxHackThreads);
		await ns.sleep(timeToHack + 50);
	}
}