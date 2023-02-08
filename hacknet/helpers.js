
/** @param {NS} ns */
export function getCheapestUpgrade(ns, currentNodes, player) {
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