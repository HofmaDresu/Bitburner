import {getStartableServers, getBestServersForHacking, weakenToMin} from "/helpers.js";
import {stockToServers, shouldLowerValueForStock, shouldRaiseValueForStock} from "/stocks/helpers.js";

/** @param {NS} ns */
export async function main(ns) {
	while(true) {			
		let myHackingLevel = ns.getHackingLevel();
		let startableServers = getStartableServers(ns, "home", myHackingLevel, null, true);
		let bestServersForHacking = getBestServersForHacking(ns, startableServers, myHackingLevel);
		const stockSymbols = Object.keys(stockToServers);
		for (let i = 0; i < stockSymbols.length; i++) {
			let stockSymbol = stockSymbols[i];
			let targetServers = stockToServers[stockSymbol].filter(server => !bestServersForHacking.includes(server)).filter(server => ns.hasRootAccess(server));
			for (let j = 0; j < targetServers.length; j++) {
				const server = targetServers[j];
				await weakenToMin(ns, server);
				if (shouldLowerValueForStock(ns, stockSymbol)) ns.hack(server, {stock: true});
				if (shouldRaiseValueForStock(ns, stockSymbol)) ns.grow(server, {stock: true});
				ns.sleep(100);
			}
		}
		ns.sleep(1000);
	}
}
