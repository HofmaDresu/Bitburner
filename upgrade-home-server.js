/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("sleep");
	if (!ns.singularity) return;
	let upgradeHomeCoresCost = 0;
	let upgradeHomeRamCost = 0;

	do {
		upgradeHomeCoresCost = ns.singularity.getUpgradeHomeCoresCost();
		upgradeHomeRamCost = ns.singularity.getUpgradeHomeRamCost();
		const availableMonies = ns.getServerMoneyAvailable("home");
		ns.print(`Upgrade cores cost ${upgradeHomeCoresCost.toLocaleString('en-US')}`);
		ns.print(`Upgrade ram cost ${upgradeHomeRamCost.toLocaleString('en-US')}`);

		if (upgradeHomeCoresCost > 0 && availableMonies > upgradeHomeCoresCost) {
			ns.singularity.upgradeHomeCores();
		}
		if (upgradeHomeRamCost > 0 && availableMonies > upgradeHomeRamCost) {
			ns.singularity.upgradeHomeRam();
		}
		await ns.sleep(60000);
	} while (upgradeHomeCoresCost > 0 || upgradeHomeRamCost > 0)
}
