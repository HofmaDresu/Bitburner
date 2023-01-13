/** @param {NS} ns */
export async function main(ns) {
    await ns.weaken(ns.getHostname());
    await ns.singularity.manualHack();
}