/** @param {NS} ns */
export async function main(ns) {
	let bestServersForHacking = [];
	while (true) {
		let myHackingLevel = ns.getHackingLevel();
		let startableServers = getStartableServers(ns, "home", myHackingLevel);
		let newBestServersForHacking = getBestServersForHacking(ns, startableServers, myHackingLevel);
		if (bestServersForHacking.toString() !== newBestServersForHacking.toString()) {
			bestServersForHacking = newBestServersForHacking;
			for (let index = 0; index < startableServers.length; index++) {
				let server = startableServers[index];
				let serverToHack = bestServersForHacking[index % bestServersForHacking.length];
				await stopServerIfRetargetNeeded(ns, startableServers, serverToHack);
				ns.run('start-server.js', 1, ...[serverToHack, server]);
			};
		}
		await ns.sleep(60000);
	}
}

function getStartableServers(ns, currentServer, myHackingLevel, previousServer) {
	let hackablePorts = 0;
	if (ns.fileExists('brutessh.exe')) hackablePorts++;
	if (ns.fileExists('ftpcrack.exe')) hackablePorts++;
	if (ns.fileExists('relaysmtp.exe')) hackablePorts++;
	if (ns.fileExists('httpworm.exe')) hackablePorts++;
	if (ns.fileExists('sqlinject.exe')) hackablePorts++;
	const servers = ns.scan(currentServer).filter(s => s != previousServer);
	if (!servers || servers.length === 0) return [];
	return servers.flatMap((s) => {
		let hasRootAccess = ns.hasRootAccess(s);

		if (!hasRootAccess) {
			let requiredHackingLevel = ns.getServerRequiredHackingLevel(s);
			if (requiredHackingLevel > myHackingLevel) { return; }
			let requiredPorts = ns.getServerNumPortsRequired(s);
			if (requiredPorts > hackablePorts) { return; }
			if (ns.fileExists('brutessh.exe')) ns.brutessh(s);
			if (ns.fileExists('ftpcrack.exe')) ns.ftpcrack(s);
			if (ns.fileExists('relaysmtp.exe')) ns.relaysmtp(s);
			if (ns.fileExists('httpworm.exe')) ns.httpworm(s);
			if (ns.fileExists('sqlinject.exe')) ns.sqlinject(s);
			ns.nuke(s);
		}

		return [s, ...getStartableServers(ns, s, myHackingLevel, currentServer)];
	}).filter(s => s).filter(async s => await ns.ps(s).length === 0).filter(s => s !== 'darkweb')
	.sort((a, b) => ns.getServerMaxRam(b) - ns.getServerMaxRam(a));
}

function getBestServersForHacking(ns, startableServers, myHackingLevel) {
	const eligibleServers = startableServers.filter(server => {
		var requiredHackingLevel = ns.getServerRequiredHackingLevel(server);
		return requiredHackingLevel < myHackingLevel / 3 && ns.getServerMaxMoney(server) > 0;
	});

	const numberOfServersToHack = Math.min(Math.ceil(startableServers.length / 10), eligibleServers.length);

	const orderedServers = eligibleServers.sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a));
	return orderedServers.slice(0, numberOfServersToHack - 1);
}

async function stopServerIfRetargetNeeded(ns, startableServers, bestServerForHacking) {
	for (let i = 0; i < startableServers.length; i++) {
		let server = startableServers[i];
		let moneyMakerProcess = await ns.ps(server).filter(process => process.filename === 'money-maker.js');
		if (!moneyMakerProcess || moneyMakerProcess.length === 0) return;
		if (moneyMakerProcess[0].args.includes(bestServerForHacking)) return;
		await ns.killall(server);
	}
}
