import {getCheapestUpgrade} from 'hacknet/helpers';

/** @param {NS} ns */
export async function main(ns) {	
    while(true) {
        const player = ns.getPlayer();
        const currentNodes = ns.hacknet.numNodes();
        const costToAddNode = ns.formulas.hacknetServers.hacknetServerCost(currentNodes+1, player.mults.hacknet_node_purchase_cost);
        const cheapestUpgrade = getCheapestUpgrade(ns, currentNodes, player);
        const cheepestUpgradeCost = Math.min((costToAddNode > 0 ? costToAddNode : Infinity), cheapestUpgrade);

        const currentHash = ns.hacknet.numHashes();

        //TODO: Much smarter, do more
        if (cheepestUpgradeCost < 10_000_000) {
            const sellCost = ns.hacknet.hashCost("Sell for Money");
            if (sellCost < currentHash) {
                ns.hacknet.spendHashes("Sell for Money");
            }
        } else {
            
        }


        await ns.sleep(1_000);
    }

}