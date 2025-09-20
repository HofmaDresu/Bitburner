/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0];
    const moneyThresh = ns.getServerMaxMoney(target);

    while(ns.getServerMoneyAvailable(target) < moneyThresh) {
        await ns.grow(target);
    } 
}