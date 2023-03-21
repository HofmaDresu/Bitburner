/** @param {NS} ns */
export async function main(ns) {
    while(true) {
        let server = ns.singularity.getCurrentServer();
        if (ns.hasRootAccess(server)) {
            await ns.weaken(ns.getHostname());
        } 
        server = ns.singularity.getCurrentServer();
        if (ns.hasRootAccess(server)) { // This is silly, but makes sure we don't try to hack when we don't have access if we change servers between weaken and hack
            await ns.singularity.manualHack();
        } 
        server = ns.singularity.getCurrentServer();
        if (!ns.hasRootAccess(server)) {
            await ns.sleep(1000);
        }
    }
}