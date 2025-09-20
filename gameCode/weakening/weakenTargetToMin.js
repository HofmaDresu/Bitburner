/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0];
    const securityThresh = ns.getServerMinSecurityLevel(target);

    while(ns.getServerSecurityLevel(target) > securityThresh) {
        await ns.weaken(target);
    } 
}