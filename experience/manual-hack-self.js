/** @param {NS} ns */
export async function main(ns) {
    while(true) {
        const server = ns.singularity.getCurrentServer();
        if (ns.hasRootAccess(server)) {
            await ns.weaken(ns.getHostname());
        } else if (ns.hasRootAccess(server)) { // This is silly, but makes sure we don't try to hack when we don't have access if we change servers between weaken and hack
            await ns.singularity.manualHack();
        } else {
            await ns.sleep(10);
        }
    }
}