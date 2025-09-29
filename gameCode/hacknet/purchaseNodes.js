import { availableSpendingMoney } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("getServerMaxMoney");

    const maxNodes = ns.hacknet.maxNumNodes();
    const canUseAllMoney = ns.flags([["canUseAllMoney", false]])["canUseAllMoney"];
    while (ns.hacknet.numNodes() < maxNodes) {
        const availableMoney = availableSpendingMoney(ns, canUseAllMoney ? 0 : .9);
        const purchaseCost = ns.hacknet.getPurchaseNodeCost();

        if (availableMoney > purchaseCost) {
            ns.hacknet.purchaseNode();
        }

        await ns.sleep(100)
    }
}