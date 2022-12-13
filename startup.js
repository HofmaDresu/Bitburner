/** @param {NS} ns */
export async function main(ns) {
	ns.run('run-money-maker.js');
	ns.run('purchase-server.js')
	ns.run('/stocks/stock-watcher.js');
	ns.run('/stocks/activate-purchases.js')
	ns.run('/stocks/play-the-market.js');
	var bestServerForHacking = getBestServerForHacking(ns);
	var startServerRam = ns.getScriptRam('start-server.js');
	var availableMemory = ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - (startServerRam * 2);
	var moneyMakerRam = ns.getScriptRam('money-maker.js');
	var maxThreads = Math.floor(availableMemory / moneyMakerRam);
	ns.run('money-maker.js', maxThreads, bestServerForHacking);	
}

function getBestServerForHacking(ns) {
	var myHackingLevel = ns.getHackingLevel();
	var startableServers = getStartableServers(ns, "home", myHackingLevel);
	var eligibleServers = startableServers.filter(server => {
		var requiredHackingLevel = ns.getServerRequiredHackingLevel(server);
		return requiredHackingLevel < myHackingLevel / 3 ;
	});

	var maxValueServer = eligibleServers.reduce((max, current) => ns.getServerMaxMoney(max) > ns.getServerMaxMoney(current) ? max : current, startableServers[0]);
	return maxValueServer;
}

function getStartableServers(ns, currentServer, myHackingLevel, previousServer) {
	var servers = ns.scan(currentServer).filter(s => s != previousServer);
	if (!servers || servers.length === 0) return [];
	return servers.flatMap((s) => {
		var hasRootAccess = ns.hasRootAccess(s);

		if (!hasRootAccess) {
			return;
		}

		return [s, ...getStartableServers(ns, s, myHackingLevel, currentServer)];
	}).filter(s => s).filter(async s => await ns.ps(s).length === 0).filter(s => s !== 'darkweb');
}
