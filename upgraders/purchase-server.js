import {copyFilesToServer} from 'helpers';

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('getServerMoneyAvailable');
	ns.disableLog('scp');
	ns.disableLog('killall');
	ns.disableLog('deleteServer');
	let currentServers = ns.getPurchasedServers();
    let ram = 16;
	let currentRamRunning = false;
	if (currentServers.length > 0) {
		currentRamRunning = true;
		ram = parseInt(currentServers[0].split("-")[2].split("g")[0]);
	}
	const maxRam = ns.getPurchasedServerMaxRam();
	//const maxRam = 131072;
    while (ram < maxRam) {
		ns.print(`Target Ram ${ram}`);
		const maxServers = ns.getPurchasedServerLimit();
		currentServers = ns.getPurchasedServers();
		const costToUpgradeServers = ns.getPurchasedServerCost(ram * 2) * maxServers;
		ns.print(`Currently have ${currentServers.length} with a max of ${maxServers}`);
		ns.print(`It will cost ${costToUpgradeServers.toLocaleString('en-US')} to upgrade servers`);
		if (costToUpgradeServers < ns.getServerMoneyAvailable("home")) {
			for (let i = 0; i < currentServers.length; i++) {
				ns.killall(currentServers[i]);
				ns.deleteServer(currentServers[i]);
			};
			ram = Math.min(ram * 2, maxRam);
			currentRamRunning = false;
		}
		if (!currentRamRunning || currentServers < maxServers) {
			await purchaseServers(ns, maxServers, ram);
		}
		currentRamRunning = true;
        await ns.sleep(10000);
    }
}

async function purchaseServers(ns, maxServers, ram) {
	for (let i = 0; i < maxServers;) {
		const serverCost = ns.getPurchasedServerCost(ram); 
		const hostname = `pserv-${i}-${ram}gb`;

		if (ns.serverExists(hostname)) {
			i++;
			continue;
		};
		if (ns.getServerMoneyAvailable("home") > serverCost) {
			ns.purchaseServer(hostname, ram);
			copyFilesToServer(ns, hostname);
			i++;
		}
		await ns.sleep(1000);
	}
}
