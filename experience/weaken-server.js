import {MAX_SINGLE_PROGRAM_RAM} from "/helpers.js";

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("getServerMinSecurityLevel");
	ns.disableLog("getServerSecurityLevel");
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("getServerMaxRam");
	ns.disableLog("getServerUsedRam");
	const server = arguments[0].args[0];

	const hostname = ns.getServer().hostname;

	const availableMemory = Math.min(ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname), MAX_SINGLE_PROGRAM_RAM);
	const weakenRam = ns.getScriptRam('/money-maker/weaken-server.js');
	const maxWeakenThreads = Math.max(Math.floor(availableMemory / weakenRam), 1);

	while (true) {
		let targetServer = ns.getServer(server);
		const player = ns.getPlayer();
		const timeToWeaken = ns.formulas.hacking.weakenTime(targetServer, player);
		ns.run("/money-maker/weaken-server.js", maxWeakenThreads, server);
		await ns.sleep(timeToWeaken + 50);
	}
}