
/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0];

    // Infinite loop that continously hacks/grows/weakens the target server
    while(true) {
        ns.weaken(target);
        ns.grow(target);
        ns.weaken(target);
        ns.hack(target);
    }
}