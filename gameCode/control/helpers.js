import { nukeServer, getServersTree } from "helpers";

const SERVERS_TO_BACKDOOR = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "The-Cave", "w0rld_d43m0n"];

/** @param {NS} ns */
export async function crackServers(ns) {
    const serverTree = getServersTree(ns, "home")
    await crackServersInTree(ns, serverTree);
}

/** @param {NS} ns */
async function crackServersInTree(ns, serverTree, parent = "home") {
    for (const server in serverTree) {
        ns.singularity.connect(server)
        if(nukeServer(ns, server) && !ns.getServer(server).backdoorInstalled && SERVERS_TO_BACKDOOR.indexOf(server) !== -1) {   
            await ns.singularity.installBackdoor();            
        }
        const leaf = serverTree[server];
        await crackServersInTree(ns, leaf, server)
        ns.singularity.connect(parent)
    }
}