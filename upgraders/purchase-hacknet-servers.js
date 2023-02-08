/** @param {NS} ns */
export async function main(ns) {	
    const maxNodes = ns.hacknet.maxNumNodes();
    let player = ns.getPlayer();
    let currentNodes = ns.hacknet.numNodes();
    let costToAddNode = ns.formulas.hacknetServers.hacknetServerCost(currentNodes+1, player.mults.hacknet_node_purchase_cost);
    let cheapestUpgrade = getCheapestUpgrade(ns, currentNodes, player);

    while (currentNodes < maxNodes && cheapestUpgrade[3] != Infinity) {
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

        await ns.sleep(10_000);
    }
}

/** @param {NS} ns */
function getCheapestUpgrade(ns, currentNodes, player) {
    let cheapestUpgrade = ['none', 0, Infinity];

    for (let i = 0; i < currentNodes; i++) {
        const server = ns.hacknet.getNodeStats(i);
        let cost = ns.formulas.hacknetServers.cacheUpgradeCost(server.cache, 1);
        if (cost < cheapestUpgrade[2] && cost !== 0) {
            cheapestUpgrade = ['cache', i, cost];
        }
        cost = ns.formulas.hacknetServers.coreUpgradeCost(server.cores, 1, player.mults.hacknet_node_core_cost);
        if (cost < cheapestUpgrade[2] && cost !== 0) {
            cheapestUpgrade = ['core', i, cost];
        }
        cost = ns.formulas.hacknetServers.levelUpgradeCost(server.level, 1, player.mults.hacknet_node_level_cost);
        if (cost < cheapestUpgrade[2] && cost !== 0) {
            cheapestUpgrade = ['level', i, cost];
        }
        cost = ns.formulas.hacknetServers.ramUpgradeCost(server.ram, 1, player.mults.hacknet_node_ram_cost);
        if (cost < cheapestUpgrade[2] && cost !== 0) {
            cheapestUpgrade = ['ram', i, cost];
        }
    }

    return cheapestUpgrade;
}