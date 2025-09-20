/** @param {NS} ns */
export function getBestServerToHack(ns) {
    const serversToHack = getServers(ns);
    const myHackingAbility = ns.getPlayer().skills.hacking;
    const serversSortedByMoney = serversToHack.sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a));
    const serversInGoodHackRange = serversSortedByMoney.filter((s) => ns.getServerRequiredHackingLevel(s) < .5 * myHackingAbility);
    const serversInAnyHackRange = serversSortedByMoney.filter((s) => ns.getServerRequiredHackingLevel(s) < myHackingAbility);

    return serversInGoodHackRange[0] || serversInAnyHackRange[0];
}

/** @param {NS} ns */
export function getServers(ns) {
    let servers = ns.scan("home").filter((s) => s.indexOf("pserv") === -1);
    let currentServersLength = 0;
    let iterator = 0;
    do {
        const newServers = ns.scan(servers[iterator]).filter((s) => servers.indexOf(s) === -1 && s !== "home");
        servers = servers.concat(newServers);
        currentServersLength = servers.length;
        iterator++;
    } while (iterator < currentServersLength);

    return servers;    
}