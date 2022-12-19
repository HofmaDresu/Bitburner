import {stockToServers} from "/stocks/helpers.js";

/** @param {NS} ns */
export async function main(ns) {
	const manipulateMarketScript = '/stocks/manipulate-market.js';
	const stockSymbols = Object.keys(stockToServers);
	const usableMemory = (ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) - 100; // reserve ~ 100 gb
	const threadsPerServer = usableMemory / (ns.getScriptRam(manipulateMarketScript) * stockSymbols.flatMap(stockSymbol => stockToServers[stockSymbol]).length);

	stockSymbols.forEach(stockSymbol => {
		stockToServers[stockSymbol].forEach(server => {
			ns.run(manipulateMarketScript, threadsPerServer, server, stockSymbol);
		});
	});
}
