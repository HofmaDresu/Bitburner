const maxNodes = 20;
/** @param {NS} ns */
export async function main(ns) {	
	for (let nodeIndex = 0; nodeIndex <= maxNodes; nodeIndex++) {
		if (nodeIndex >=  ns.hacknet.numNodes()) {
			while(getSpendableMoney(ns) <= ns.hacknet.getPurchaseNodeCost()) {
				await ns.sleep(60000);
			}
			ns.hacknet.purchaseNode();
		}

		while (ns.hacknet.getNodeStats(nodeIndex).level < 200) {
			if (getSpendableMoney(ns) >= ns.hacknet.getLevelUpgradeCost(nodeIndex, 1)) {
				ns.hacknet.upgradeLevel(nodeIndex, 1);
				await ns.sleep(100);
			} else {
				await ns.sleep(60000);
			}
		}
		while (ns.hacknet.getNodeStats(nodeIndex).ram < 60) {
			if (getSpendableMoney(ns) >= ns.hacknet.getRamUpgradeCost(nodeIndex, 1)) {
				ns.hacknet.upgradeRam(nodeIndex, 1);
				await ns.sleep(100);
			} else {
				await ns.sleep(60000);
			}
		}
		while (ns.hacknet.getNodeStats(nodeIndex).cores < 16) {
			if (getSpendableMoney(ns) >= ns.hacknet.getCoreUpgradeCost(nodeIndex, 1)) {
				ns.hacknet.upgradeCore(nodeIndex, 1);
				await ns.sleep(100);
			} else {
				await ns.sleep(60000);
			}
		}

		await ns.sleep(100);
	}
}

function getSpendableMoney(ns) {
	return .8 * ns.getServerMoneyAvailable("home");
}
