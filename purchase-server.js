/** @param {NS} ns */
export async function main(ns) {
	let currentServers = ns.getPurchasedServers();
    var ram = 8;
	var currentRamRunning = false;
	if (currentServers.length > 0) {
		currentRamRunning = true;
		ram = parseInt(currentServers[0].split("-")[2].split("g")[0]);
	}
	var madeNewServers = false;
	var maxRam = ns.getPurchasedServerMaxRam();


    while (ram <= maxRam) {
		madeNewServers = false;
		var maxServers = ns.getPurchasedServerLimit();
		currentServers = ns.getPurchasedServers();
		var costToUpgradeServers = ns.getPurchasedServerCost(ram * 2) * maxServers;
		if (currentServers.length === maxServers &&  costToUpgradeServers < ns.getServerMoneyAvailable("home")) {
			for (var i = 0; i < currentServers.length; i++) {
				ns.killall(currentServers[i]);
				ns.deleteServer(currentServers[i]);
			};
			ram = Math.min(ram * 2, maxRam);
			currentRamRunning = false;
		}
		if (!currentRamRunning) {
			purchaseServers(ns, maxServers, ram);
			madeNewServers  = true;
		}
		currentRamRunning = true;
		// Only start new servers if we neither made nor deleted servers in this loop. This prevents error messages from start-server
		if (!madeNewServers && currentRamRunning) {
			startServers(ns, currentServers);
		}
        await ns.sleep(60000);
    }
}

function purchaseServers(ns, maxServers, ram) {
	for (var i = 0; i < maxServers; i++) {
		var serverCost = ns.getPurchasedServerCost(ram); 
		var hostname = `pserv-${i}-${ram}gb`;

		if (ns.serverExists(hostname)) continue;
		if (ns.getServerMoneyAvailable("home") > serverCost) {
			ns.purchaseServer(hostname, ram);
			ns.scp("money-maker.js", hostname);
		}
	}
}

function startServers(ns, servers) {
		var myHackingLevel = ns.getHackingLevel();
		var bestServerForHacking = getBestServerForHacking(ns, getStartableServers(ns, "home", myHackingLevel), myHackingLevel)
		ns.run('start-server.js', 1, ...[bestServerForHacking, ...servers]);
}

function getBestServerForHacking(ns, startableServers, myHackingLevel) {
	var eligibleServers = startableServers.filter(server => {
		var requiredHackingLevel = ns.getServerRequiredHackingLevel(server);
		return requiredHackingLevel < myHackingLevel / 3 ;
	});

	var maxValueServer = eligibleServers.reduce((max, current) => ns.getServerMaxMoney(max) > ns.getServerMaxMoney(current) ? max : current, "n00dles");
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
	}).filter(s => s).filter(async s => await ns.ps(s).length === 0);
}
