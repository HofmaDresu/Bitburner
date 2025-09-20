/** @param {NS} ns */
export function getBestServerToHack(ns) {
    const serversToHack = ns.scan("home").filter((s) => s.indexOf("pserv") === -1);
    const myHackingAbility = ns.getPlayer().skills.hacking;
    const serversInGoodHackRange = serversToHack.filter((s) => ns.getServerRequiredHackingLevel(s) < .5 * myHackingAbility);
    const serversSortedByMoney = serversInGoodHackRange.sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a));

    return serversSortedByMoney[0];
}