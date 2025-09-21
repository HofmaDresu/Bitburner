/** @param {NS} ns */
export function getBestServerToHack(ns) {
    const serversToHack = getServers(ns);
    const myHackingAbility = ns.getPlayer().skills.hacking;
    const serversWithRootAccess = serversToHack.filter(ns.hasRootAccess);
    const serversSortedByMoney = serversWithRootAccess.sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a));
    const serversInGoodHackRange = serversSortedByMoney.filter((s) => ns.getServerRequiredHackingLevel(s) < .5 * myHackingAbility);
    const serversInAnyHackRange = serversSortedByMoney.filter((s) => ns.getServerRequiredHackingLevel(s) < myHackingAbility);

    return serversInGoodHackRange[0] || serversInAnyHackRange[0] || "n00dles";
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

/** @param {NS} ns */
export function copyAndRunHackingScripts(ns, hostname, target) {
    ns.scp(["control/makeMoneyFromTarget.js", "growing/growTarget.js", "growing/growTargetToMax.js", "hacking/hackTarget.js", "weakening/weakenTargetToMin.js", "weakening/weakenTarget.js"], hostname);
    const bestServerToHack =  getBestServerToHack(ns);
    ns.exec("control/makeMoneyFromTarget.js", hostname, 1, target);
}

/** @param {NS} ns */
export function availableSpendingMoney(ns, reserveAmount = .1) {
    return ns.getServerMoneyAvailable("home") * (1 - reserveAmount);
}