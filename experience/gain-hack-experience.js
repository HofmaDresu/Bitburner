import {MAX_SINGLE_PROGRAM_RAM} from "/helpers.js";

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("getServerMinSecurityLevel");
	ns.disableLog("getServerSecurityLevel");
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("getServerMaxRam");
	ns.disableLog("getServerUsedRam");
	const server = "n00dles";

	const hostname = ns.getServer().hostname;

	let availableMemory = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);
	if (hostname === "home") {
		availableMemory *= .8;
	}
	const weakenRam = ns.getScriptRam('/money-maker/weaken-server.js');
	const maxWeakenThreads = Math.max(Math.floor(availableMemory / weakenRam), 1);

	while (true) {
		let targetServer = ns.getServer(server);
		const player = ns.getPlayer();
		const timeToWeaken = ns.formulas.hacking.weakenTime(targetServer, player);
		ns.run("/money-maker/weaken-server.js", maxWeakenThreads, server, self.crypto.randomUUID());
		await ns.sleep(timeToWeaken + 50);
	}
}