import {weakenToMin} from '/helpers.js';

/** @param {NS} ns */
export async function main(ns) {
	const server = arguments[0].args[0];
	await weaken(ns, server);
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
		await weakenToMin(ns, server);
		currentServerMoney = await ns.getServerMoneyAvailable(server);
	}	
}
