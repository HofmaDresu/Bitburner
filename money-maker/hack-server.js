/** @param {NS} ns */
export async function main(ns) {
	const server = arguments[0].args[0];
    await ns.hack(server);	
}