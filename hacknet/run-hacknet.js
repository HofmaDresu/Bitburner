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
        const cheepestUpgradeCost = Math.min((costToAddNode > 0 ? costToAddNode : Infinity), cheapestUpgrade);

        const currentHash = ns.hacknet.numHashes();
        const myHackingLevel = ns.getHackingLevel();
        const orderedHackingServers = getBestServersForHacking(ns, myHackingLevel).map(s => ns.getServer(s));
        const orderedNotMinSecurityServers = orderedHackingServers.filter(s => s.minDifficulty > 1);
        const orderedNotMaxMoneyServers = orderedHackingServers.filter(s => s.maxMoney < 10_000_000_000_000 * multipliers.ServerMaxMoney);

        //TODO: Much smarter, do more
        if (cheepestUpgradeCost < 10_000_000) {
            if (ns.hacknet.hashCost("Sell for Money") < currentHash) {
                ns.hacknet.spendHashes("Sell for Money");
            }
        } else if (orderedNotMinSecurityServers > 0) {
            if (ns.hacknet.hashCost("Reduce Minimum Security") < currentHash) {
                ns.hacknet.spendHashes("Reduce Minimum Security", orderedNotMinSecurityServers[0]);
            }
        } else if (orderedNotMaxMoneyServers > 0) {
            if (ns.hacknet.hashCost("Increase Maximum Money") < currentHash) {
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