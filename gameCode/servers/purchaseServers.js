/** @param {NS} ns */
export async function main(ns) {
    let ram = 8;
    ns.disableLog("sleep");
    ns.disableLog("getServerMoneyAvailable");

    await purchaseServersToLimit(ns, ram);

    while (ns.getPurchasedServerMaxRam() >= ram * 2) {
        const oldRam = ram;
        const newRam = ram * 2;
        await upgradeServersToRam(ns, oldRam, newRam);
        ram = newRam;
    }
}

/** @param {NS} ns */
async function purchaseServersToLimit(ns, ram) {
    let i = ns.getPurchasedServers().length;
    while (i < ns.getPurchasedServerLimit()) {
        // Check if we have enough money to purchase a server
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            purchaseAndStartServer(ns, ram);
            ++i;
        }
        //Make the script wait for a second before looping again.
        //Removing this line will cause an infinite loop and crash the game.
        await ns.sleep(1000);
    }
}

/** @param {NS} ns */
function purchaseAndStartServer(ns, ram) {
    let hostname = ns.purchaseServer(`pserv-${ram}gb`, ram);
    ns.scp(["control/makeMoneyFromTarget.js", "growing/growTargetToMax.js", "hacking/hackTarget.js", "weakening/weakenTargetToMin.js"], hostname);
    ns.exec("control/makeMoneyFromTarget.js", hostname, 1, "joesguns");
}

/** @param {NS} ns */
async function upgradeServersToRam(ns, oldRam, newRam) {
    let currentLowRamServers = ns.getPurchasedServers().filter((s) => s.indexOf(`${oldRam}gb`) !== -1);
    while (currentLowRamServers.length > 0) {
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(newRam)) {
            const oldServer = currentLowRamServers.pop();
            ns.killall(oldServer);
            ns.deleteServer(oldServer);
            purchaseAndStartServer(ns, newRam);
        }
        await ns.sleep(1000);
    }
}