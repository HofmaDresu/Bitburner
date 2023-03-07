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
        const orderedNotMinSecurityServers = orderedHackingServers.filter(s => s.minDifficulty > 1).sort((a, b) => b.minDifficulty - a.minDifficulty).map(s => s.hostname);
        const orderedNotMaxMoneyServers = orderedHackingServers.filter(s => s.moneyMax < 10_000_000_000_000 * multipliers.ServerMaxMoney).map(s => s.hostname);

        const maxHashes = ns.hacknet.hashCapacity();
        const costToDecreaseSecurity = ns.hacknet.hashCost("Reduce Minimum Security");
        const costToBoostMoney = ns.hacknet.hashCost("Increase Maximum Money");        

        if (cheepestUpgradeCost < 50_000_000 || !ns.scriptRunning("/automation/script-starter.js", "home")) {
            if (ns.hacknet.hashCost("Sell for Money") < currentHash) {
                ns.hacknet.spendHashes("Sell for Money");
            }
            await ns.sleep(getSleepTime(ns, 2));
        } else if (orderedNotMinSecurityServers.length > 0 && costToDecreaseSecurity <= maxHashes && (orderedNotMaxMoneyServers.length == 0 || costToDecreaseSecurity < 2 * costToBoostMoney)) {
            if (costToDecreaseSecurity < currentHash) {
                ns.hacknet.spendHashes("Reduce Minimum Security", orderedNotMinSecurityServers[0]);
            }
            await ns.sleep(getSleepTime(ns, costToDecreaseSecurity));
        } else if (orderedNotMaxMoneyServers.length > 0 && costToBoostMoney <= maxHashes) {
            if (costToBoostMoney < currentHash) {
                ns.hacknet.spendHashes("Increase Maximum Money", orderedNotMaxMoneyServers[0]);
            }
            await ns.sleep(getSleepTime(ns, costToBoostMoney));
        } else {
            if (ns.hacknet.hashCost("Sell for Money") < currentHash) {
                ns.hacknet.spendHashes("Sell for Money");
            }
            await ns.sleep(getSleepTime(ns, 4));
        }

    }

    /** @param {NS} ns */
    function getSleepTime(ns, actionCost) {
        const hacknetServerStats = Array.from({length:  ns.hacknet.numNodes()}, (x, i) => i).map(x => ns.hacknet.getNodeStats(x));
        const totalProduction = hacknetServerStats.map(x => x.production).reduce((sum, curr) => sum += curr, 0);

        return Math.max(100, (1_000 * (actionCost / totalProduction)) - 100);
    }
}