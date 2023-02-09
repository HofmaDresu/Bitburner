import {getCheapestUpgrade} from 'hacknet/helpers';
import {getBestServersForHacking} from "/helpers.js";

/** @param {NS} ns */
export async function main(ns) {	
    ns.disableLog("getServerMaxMoney");
    ns.disableLog("getServerRequiredHackingLevel");
    ns.disableLog("scan");
    ns.disableLog("getHackingLevel");
    ns.disableLog("sleep");
    const multipliers = ns.getBitNodeMultipliers();
    while(true) {
        const player = ns.getPlayer();
        const currentNodes = ns.hacknet.numNodes();
        const costToAddNode = ns.formulas.hacknetServers.hacknetServerCost(currentNodes+1, player.mults.hacknet_node_purchase_cost);
        const cheapestUpgrade = getCheapestUpgrade(ns, currentNodes, player);
        const cheepestUpgradeCost = Math.min((costToAddNode > 0 ? costToAddNode : Infinity), cheapestUpgrade[2]);

        const currentHash = ns.hacknet.numHashes();
        const myHackingLevel = ns.getHackingLevel();
        const orderedHackingServers = getBestServersForHacking(ns, myHackingLevel).map(s => ns.getServer(s));
        const orderedNotMinSecurityServers = orderedHackingServers.filter(s => s.minDifficulty > 1).map(s => s.hostname);
        const orderedNotMaxMoneyServers = orderedHackingServers.filter(s => s.maxMoney < 10_000_000_000_000 * multipliers.ServerMaxMoney).map(s => s.hostname);

        const maxHashes = ns.hacknet.hashCapacity();
        const costToDecreaseSecurity = ns.hacknet.hashCost("Reduce Minimum Security");
        const costToBoostMoney = ns.hacknet.hashCost("Increase Maximum Money");

        if (cheepestUpgradeCost < 10_000_000) {
            if (ns.hacknet.hashCost("Sell for Money") < currentHash) {
                ns.hacknet.spendHashes("Sell for Money");
            }
        } else if (orderedNotMinSecurityServers.length > 0 && costToDecreaseSecurity <= maxHashes) {
            if (costToDecreaseSecurity < currentHash) {
                ns.hacknet.spendHashes("Reduce Minimum Security", orderedNotMinSecurityServers[0]);
            }
        } else if (orderedNotMaxMoneyServers.length > 0 && costToBoostMoney <= maxHashes) {
            if (costToBoostMoney < currentHash) {
                ns.hacknet.spendHashes("Increase Maximum Money", orderedNotMaxMoneyServers[0]);
            }
        } else {
            if (ns.hacknet.hashCost("Sell for Money") < currentHash) {
                ns.hacknet.spendHashes("Sell for Money");
            }
        }


        await ns.sleep(1_000);
    }

}