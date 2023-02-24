import {getCheapestUpgrade} from 'hacknet/helpers';

/** @param {NS} ns */
export async function main(ns) {	
    const maxNodes = ns.hacknet.maxNumNodes();
    let player = ns.getPlayer();
    let currentNodes = ns.hacknet.numNodes();
    let costToAddNode = ns.formulas.hacknetServers.hacknetServerCost(currentNodes+1, player.mults.hacknet_node_purchase_cost);
    let cheapestUpgrade = getCheapestUpgrade(ns, currentNodes, player);

    while (currentNodes < maxNodes || cheapestUpgrade[3] != Infinity) {
        player = ns.getPlayer();
        currentNodes = ns.hacknet.numNodes();
        costToAddNode = ns.formulas.hacknetServers.hacknetServerCost(currentNodes+1, player.mults.hacknet_node_purchase_cost);
        cheapestUpgrade = getCheapestUpgrade(ns, currentNodes, player);
        const serverMoney = ns.getServerMoneyAvailable("home");
        if (costToAddNode < cheapestUpgrade[2] && costToAddNode < serverMoney) {
            ns.hacknet.purchaseNode();
        } else if (cheapestUpgrade[2] < serverMoney) {
            switch(cheapestUpgrade[0]) {
                case 'cache':
                    ns.hacknet.upgradeCache(cheapestUpgrade[1], 1);
                    break;
                case 'core':
                    ns.hacknet.upgradeCore(cheapestUpgrade[1], 1);
                    break;
                case 'level':
                    ns.hacknet.upgradeLevel(cheapestUpgrade[1], 1);
                    break;
                case 'ram':
                    ns.hacknet.upgradeRam(cheapestUpgrade[1], 1);
                    break;
            }
        }

        await ns.sleep(1_000);
    }
}