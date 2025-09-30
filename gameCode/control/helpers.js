import { nukeServer, getServersTree } from "helpers";

/** @param {NS} ns */
export async function crackServers(ns) {
    const serverTree = getServersTree(ns, "home")
    await crackServersInTree(ns, serverTree);
}

/** @param {NS} ns */
async function crackServersInTree(ns, serverTree, parent = "home") {
    for (const server in serverTree) {
        ns.singularity.connect(server)
        if(nukeServer(ns, server) && !ns.getServer(server).backdoorInstalled && server !== "home") {   
            await ns.singularity.installBackdoor();            
        }
        const leaf = serverTree[server];
        await crackServersInTree(ns, leaf, server)
        ns.singularity.connect(parent)
    }
}