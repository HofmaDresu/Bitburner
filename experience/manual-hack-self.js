/** @param {NS} ns */
export async function main(ns) {
    while(true) {
        const server = ns.singularity.getCurrentServer();
        if (ns.hasRootAccess(server)) {
            await ns.weaken(ns.getHostname());
            await ns.singularity.manualHack();
        } else {
            await ns.sleep(10);
        }
    }
}