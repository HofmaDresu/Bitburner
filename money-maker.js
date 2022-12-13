/** @param {NS} ns */
export async function main(ns) {
	const server = arguments[0].args[0];
	while(true) {
		await makeMoneyFromServer(ns, server);
	}
}

async function makeMoneyFromServer(ns, server) {
	await prepServerForHack(ns, server);
	await ns.hack(server);
}

async function prepServerForHack(ns, server) {
	const maxServerMoney = await ns.getServerMaxMoney(server);
	let currentServerMoney = await ns.getServerMoneyAvailable(server);
	while (currentServerMoney < maxServerMoney * .75) {
		await ns.grow(server);
		await weaken(ns, server);
		currentServerMoney = await ns.getServerMoneyAvailable(server);
	}	
}

async function weaken(ns, server) {
	const minSecurityLevel = ns.getServerMinSecurityLevel(server);
	while (await ns.getServerSecurityLevel(server) > minSecurityLevel + 1) {
		await ns.weaken(server);
	}
}
