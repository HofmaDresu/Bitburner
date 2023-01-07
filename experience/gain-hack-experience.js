/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("getServerMinSecurityLevel");
	ns.disableLog("getServerSecurityLevel");
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("getServerMaxRam");
	ns.disableLog("getServerUsedRam");

	const hostname = ns.getServer().hostname;

	var availableMemory = (ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname));
	const weakenRam = ns.getScriptRam('/money-maker/weaken-server.js');
	const maxWeakenThreads = Math.max(Math.floor(availableMemory / weakenRam), 1);

	while (true) {
		let targetServer = ns.getServer("n00dles");
		const player = ns.getPlayer();
		const timeToWeaken = ns.formulas.hacking.weakenTime(targetServer, player);
		ns.run("/money-maker/weaken-server.js", maxWeakenThreads, "n00dles");
		await ns.sleep(timeToWeaken + 50);
	}
}