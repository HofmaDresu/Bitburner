import { availableSpendingMoney } from "helpers";

const NONE = "none";
const RAM = "ram";
const CORE = "core";
const LEVEL = "level";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("getServerMaxMoney");

    let anyUpgradeIsAvailable = true;

    while(anyUpgradeIsAvailable) {
        const numberOfNodes = ns.hacknet.numNodes();

        for(let nodeIndex = 0; nodeIndex < numberOfNodes; nodeIndex++) {
            const cheapestUpgradeType = getCheapestUpgrade(ns, nodeIndex);
            upgradeIfPossible(ns, nodeIndex, cheapestUpgradeType);
            await ns.sleep(1000)
        }
        
        anyUpgradeIsAvailable = isAnyUpgradeAvailable(ns, numberOfNodes);
        await ns.sleep(1000)
    }

}

/** @param {NS} ns */
function isAnyUpgradeAvailable(ns, numberOfNodes) {
    if (numberOfNodes < ns.hacknet.maxNumNodes()) {
        return true;
    }

    for(let i = 0; i < numberOfNodes; i++) {
        if(getCheapestUpgrade(ns, nodeIndex) !== NONE) {
            return true;
        }
    }

    return false;
}

/** @param {NS} ns */
function upgradeIfPossible(ns, nodeIndex, upgradeType) {
    const availableMoney = availableSpendingMoney(ns, .9);
    function upgrade(priceCheckFn, upgradeFn) {
        if(priceCheckFn(nodeIndex, 1) < availableMoney) {
            upgradeFn(nodeIndex, 1);
        }
    };

    switch(upgradeType) {
        case CORE:
            upgrade(ns.hacknet.getCoreUpgradeCost, ns.hacknet.upgradeCore);
            break;
        case RAM:
            upgrade(ns.hacknet.getRamUpgradeCost, ns.hacknet.upgradeRam);
            break;
        case LEVEL:
            upgrade(ns.hacknet.getLevelUpgradeCost, ns.hacknet.upgradeLevel);
            break;
    }
}

/** @param {NS} ns */
function getCheapestUpgrade(ns, nodeIndex) {
    const coreCost = ns.hacknet.getCoreUpgradeCost(nodeIndex, 1);
    const ramCost = ns.hacknet.getRamUpgradeCost(nodeIndex, 1);
    const levelCost = ns.hacknet.getLevelUpgradeCost(nodeIndex, 1);

    if (Math.min(coreCost, ramCost, levelCost) === Infinity) {
        return NONE;
    }
    if (Math.min(coreCost, ramCost, levelCost) === coreCost) {
        return CORE;
    }
    if (Math.min(coreCost, ramCost, levelCost) === ramCost) {
        return RAM;
    }
    if (Math.min(coreCost, ramCost, levelCost) === levelCost) {
        return LEVEL;
    }
    return NONE;
}