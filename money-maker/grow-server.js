/** @param {NS} ns */
export async function main(ns) {
	const server = arguments[0].args[0];
	const shouldManipulateMarket = arguments[0].args[1] || false;
    await ns.grow(server, {stock: shouldManipulateMarket});	
}