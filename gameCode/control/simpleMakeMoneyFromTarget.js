
/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0];

    // Infinite loop that continously hacks/grows/weakens the target server
    while(true) {
        await ns.weaken(target);
        await ns.grow(target);
        await ns.weaken(target);
        await ns.hack(target);
    }
}