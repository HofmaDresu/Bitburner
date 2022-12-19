import {weakenToMin, hackToTargetPercent, growToTargetPercent, crackServerIfNeededAndPossible} from "/helpers.js";
import {shouldLowerValueForStock, shouldRaiseValueForStock} from "/stocks/helpers.js";

/** @param {NS} ns */
export async function main(ns) {
	while(true) {
		const server = arguments[0].args[0];
		const stockSymbol = arguments[0].args[1];
		if (!ns.hasRootAccess(server)) {
			crackServerIfNeededAndPossible(ns, server, ns.getHackingLevel());
			await ns.sleep(60000);
			continue;
		}
		
		const shouldLower = shouldLowerValueForStock(ns, stockSymbol);
		const shouldRaise = shouldRaiseValueForStock(ns, stockSymbol);
		ns.print(`${server}: Lower ${shouldLower}, Raise ${shouldRaise}`)
		if (shouldLower || shouldRaise) await weakenToMin(ns, server);
		if (shouldLower) await lowerValue(ns, server);
		if (shouldRaise) await raiseValue(ns, server);
		await ns.sleep(100);
	}
}

/** @param {NS} ns */
async function raiseValue(ns, server) {
	await hackToTargetPercent(ns, server, .25, false);
	await growToTargetPercent(ns, server, .75, true);
}

/** @param {NS} ns */
async function lowerValue(ns, server) {
	await growToTargetPercent(ns, server, .75, false);
	await hackToTargetPercent(ns, server, .25, true);
}
