import { copyAndRunHackingScripts, availableSpendingMoney } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    const ram = 8;
    ns.disableLog("sleep");
    ns.disableLog("getServerMoneyAvailable");

    let i = ns.getPurchasedServers().length;

    while (i < ns.getPurchasedServerLimit()) {
        if (availableSpendingMoney(ns, 0) > ns.getPurchasedServerCost(ram)) {
            let hostname = ns.purchaseServer(`pserv-${ram}gb-${i}`, ram);
            copyAndRunHackingScripts(ns, hostname, "n00dles")
            ++i;
        }
        
        await ns.sleep(1000);
    }
}