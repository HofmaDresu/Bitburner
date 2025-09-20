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
    ns.disableLog("nuke");
    ns.disableLog("exec");
    ns.disableLog("scan");
    ns.ui.openTail();
    await ns.asleep(1000);

    const servers = getServers(ns);
    ns.print(servers);

    while(true) {
        startServers(ns, servers);
        await ns.asleep(10000);
    }
}

/** @param {NS} ns */
function getServers(ns) {
    let servers = ns.scan("home").filter((s) => s !== parent && s.indexOf("pserv") === -1);
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
async function startServers(ns, servers) {
    for (let server of servers) {
        startServerIfPossible(ns, server);
    };
    await ns.asleep(1000);
}

/** @param {NS} ns */
 function startServerIfPossible(ns, server) {
    const moneyThresh = ns.getServerMaxMoney(server);
    const player = ns.getPlayer();
    const requiredHackingLevel = ns.getServerRequiredHackingLevel(server);
    const requiredNumPorts = ns.getServerNumPortsRequired(server);

    if (player.skills.hacking < requiredHackingLevel) return;
    if (moneyThresh === 0) return;

    let portCount = 0;
    if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(server);
        portCount++;
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
        ns.ftpcrack(server);
        portCount++;
    }

    if (portCount < requiredNumPorts) return;
    ns.nuke(server);
    
    const mainScript = "control/makeMoneyFromTarget.js";
    if (ns.scriptRunning)
    ns.scp([mainScript, "growing/growTargetToMax.js", "hacking/hackTarget.js", "weakening/weakenTargetToMin.js"], server);
    ns.print(`Attempting to start server '${server}'`)
    ns.exec(mainScript, server, 1, server);
}