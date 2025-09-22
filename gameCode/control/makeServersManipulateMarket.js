import { getServers, copyAndRunMarketManipulationScripts } from 'helpers';

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("disableLog");
    ns.disableLog("asleep");
    ns.disableLog("sleep");
    ns.disableLog("scp");
    ns.disableLog("getServerMaxMoney");
    ns.disableLog("getServerRequiredHackingLevel");
    ns.disableLog("getServerNumPortsRequired");
    ns.disableLog("brutessh");
    ns.disableLog("ftpcrack");
    ns.disableLog("relaysmtp");
    ns.disableLog("httpworm");
    ns.disableLog("sqlinject");
    ns.disableLog("nuke");
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
    const player = ns.getPlayer();
    const requiredHackingLevel = ns.getServerRequiredHackingLevel(server);
    const requiredNumPorts = ns.getServerNumPortsRequired(server);

    if (player.skills.hacking < requiredHackingLevel) return;

    let portCount = 0;
    if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(server);
        portCount++;
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
        ns.ftpcrack(server);
        portCount++;
    }
    if (ns.fileExists("relaySMTP.exe", "home")) {
        ns.relaysmtp(server);
        portCount++;
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
        ns.httpworm(server);
        portCount++;
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
        ns.sqlinject(server);
        portCount++;
    }

    if (portCount < requiredNumPorts) return;
    ns.nuke(server);
    
    const makeMoneyScript = "control/makeMoneyFromTarget.js";
    if (ns.scriptRunning(makeMoneyScript, server)) {
        ns.killall(server);
    };
    const mainScript = "stocks/manipulateTheMarket.js";
    if (ns.scriptRunning(mainScript, server)) return;
    if (ns.getServerMaxRam(server) < ns.getScriptRam(mainScript)) return;

    ns.print(`Attempting to start server '${server}'`)
    copyAndRunMarketManipulationScripts(ns, server, server)
}