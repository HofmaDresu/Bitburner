/* server {
    name: string,
    

} */


/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("asleep");
    ns.disableLog("sleep");
    ns.disableLog("scp");
    ns.disableLog("getServerMaxMoney");
    ns.disableLog("getServerRequiredHackingLevel");
    ns.disableLog("getServerNumPortsRequired");
    ns.disableLog("brutessh");
    ns.disableLog("nuke");
    ns.disableLog("scp");
    ns.disableLog("scp");
    ns.ui.openTail();
    await ns.asleep(1000);


    //while(true) {
        dfsServers(ns, "", "home");

//        await ns.asleep(10000);
  //  }

}

/** @param {NS} ns */
async function dfsServers(ns, parent, current) {
        ns.print(`New run with parent ${parent}, current ${current}`)

    const newServers = ns.scan(current).filter((s) => s !== parent && s.indexOf("pserv") === -1);
    ns.print(`newServers: ${newServers}`)
    if (newServers.length > 0) {
        for (let server of newServers) {    
            ns.print(`Looping with parent ${parent}, current ${current} and server ${server}`)
            startServerIfPossible(ns, server);
            //await dfsServers(ns, current, server)
            // await ns.asleep(1000);
        };
    }
    await ns.asleep(1000);
}

/** @param {NS} ns */
 function startServerIfPossible(ns, server) {
    ns.print(`Attempting to start server '${server}'`)
    const moneyThresh = ns.getServerMaxMoney(server);
    const player = ns.getPlayer();
    const requiredHackingLevel = ns.getServerRequiredHackingLevel(server);
    const requiredNumPorts = ns.getServerNumPortsRequired(server);

    if (player.skills.hacking < requiredHackingLevel) return;
    if (moneyThresh === 0) return;
    //TODO skip if already running

    let portCount = 0;
    if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(server);
        portCount++;
    }

    if (portCount < requiredNumPorts) return;
    ns.nuke(server);    
    
    ns.scp(["control/makeMoneyFromTarget.js", "growing/growTargetToMax.js", "hacking/hackTarget.js", "weakening/weakenTargetToMin.js"], server);
    ns.exec("control/makeMoneyFromTarget.js", server, 1, server);
}