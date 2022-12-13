/** @param {NS} ns */
export async function main(ns) {
	let currentServers = ns.getPurchasedServers();
    var ram = 8;
	var currentRamRunning = false;
	if (currentServers.length > 0) {
		currentRamRunning = true;
		ram = parseInt(currentServers[0].split("-")[2].split("g")[0]);
	}
	var maxRam = ns.getPurchasedServerMaxRam();

    while (ram <= maxRam) {
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
		}
		currentRamRunning = true;
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
