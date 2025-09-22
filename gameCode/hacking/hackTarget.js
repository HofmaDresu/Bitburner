/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0];
    const manipulateStock = ns.args.length == 2 ? ns.args[1] : false;
    await ns.hack(target, {stock: manipulateStock});
}