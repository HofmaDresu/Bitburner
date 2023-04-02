import {weakenToMin} from "helpers";

/** @param {NS} ns */
export async function main(ns) {
	const server = arguments[0].args[0];
	await weakenToMin(ns, server);
	while(true) {
		await makeMoneyFromServer(ns, server);
	}
}

/** @param {NS} ns */
async function makeMoneyFromServer(ns, server) {
	const maxMoney = ns.getServerMaxMoney(server);
	const targetGrowMoney = maxMoney * 1.0;
	const targetHackMoney = maxMoney * 0.5;
	let currentMoney = ns.getServerMoneyAvailable(server);
	while (currentMoney < targetGrowMoney) {
		await weakenToMin(ns, server);
		await ns.grow(server);		
		currentMoney = ns.getServerMoneyAvailable(server);
	}
	while (currentMoney > targetHackMoney) {
		await weakenToMin(ns, server);
		await ns.hack(server);			
		currentMoney = ns.getServerMoneyAvailable(server);
	}
}
