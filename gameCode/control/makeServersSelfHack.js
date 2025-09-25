import { getServers, copyAndRunHackingScripts } from 'helpers';

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("disableLog");
    ns.disableLog("asleep");
    ns.disableLog("sleep");
    ns.disableLog("scp");
    ns.disableLog("getServerMaxMoney");
    ns.disableLog("exec");
    ns.disableLog("scan");
    ns.disableLog("getServerMaxRam");

    const servers = getServers(ns);

    while(true) {
        startServers(ns, servers);
        await ns.asleep(10000);
    }
}

/** @param {NS} ns */
async function startServers(ns, servers) {
    for (let server of servers) {
        startServerIfPossible(ns, server);
    };
    await ns.asleep(1000);
}

/** @param {NS} ns */
 function startServerIfPossible(ns, server) {    
    const mainScript = "control/makeMoneyFromTarget.js";
    if (ns.scriptRunning(mainScript, server)) {
        return;
    } else {
        ns.killall(server);
    }
    if (ns.getServerMaxRam(server) < ns.getScriptRam(mainScript)) return;

    ns.print(`Attempting to start server '${server}'`)
    copyAndRunHackingScripts(ns, server, server)
}