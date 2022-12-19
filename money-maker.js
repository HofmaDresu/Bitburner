import {weakenToMin, hackToTargetPercent, growToTargetPercent} from "/helpers.js";

/** @param {NS} ns */
export async function main(ns) {
	const server = arguments[0].args[0];
	await weakenToMin(ns, server);
	while(true) {
		await makeMoneyFromServer(ns, server);
	}
}

async function makeMoneyFromServer(ns, server) {
	await growToTargetPercent(ns, server, 1, false);
	await hackToTargetPercent(ns, server, .50, false);
}
