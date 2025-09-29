import { availableSpendingMoney } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("getServerMaxMoney");

    const maxNodes = ns.hacknet.maxNumNodes();
    while (ns.hacknet.numNodes() < maxNodes) {
        // TODO: param for no reserve
        const availableMoney = availableSpendingMoney(ns, .9);
        const purchaseCost = ns.hacknet.getPurchaseNodeCost();

        if (availableMoney > purchaseCost) {
            ns.hacknet.purchaseNode();
        }

        await ns.sleep(100)
    }
}