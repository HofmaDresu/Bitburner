import {stockToServers, portfolioFileName, purchaseWseIfNeeded, purchaseTIXAPIAccessIfNeeded} from "/stocks/helpers.js";

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('getServerMaxMoney');
	await purchaseWseIfNeeded(ns);
	await purchaseTIXAPIAccessIfNeeded(ns);
	const manipulateMarketScript = '/stocks/manipulate-market.js';
	ns.scriptKill(manipulateMarketScript, "home");
	const stockSymbols = Object.keys(stockToServers);
	let threadsPerServer = getThreadsPerServer(ns, manipulateMarketScript, stockSymbols);

	while (threadsPerServer < 1) {
		await ns.sleep(60000);
		threadsPerServer = getThreadsPerServer(ns, manipulateMarketScript, stockSymbols);
	}

	stockSymbols.forEach(stockSymbol => {
		stockToServers[stockSymbol].filter(s => s).filter(server => ns.getServerMaxMoney(server)).sort((a, b) => ns.getServerRequiredHackingLevel(a) - ns.getServerRequiredHackingLevel(b)).forEach(server => {
			ns.run(manipulateMarketScript, threadsPerServer, server, stockSymbol);
		});
	});
}


/** @param {NS} ns */
function getThreadsPerServer(ns, manipulateMarketScript, stockSymbols) {
	const usableMemory = (ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) - 100; // reserve ~ 100 gb
	var threadsPerServer = usableMemory / (ns.getScriptRam(manipulateMarketScript) * 
		stockSymbols.flatMap(stockSymbol => stockToServers[stockSymbol]).filter(server => ns.getServerMaxMoney(server)).length);
	return threadsPerServer;
}
