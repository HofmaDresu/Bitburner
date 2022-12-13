/** @param {NS} ns */
export function getStartableServers(ns, currentServer, myHackingLevel, previousServer, gainRootAccessIfPossible = false) {
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

		if (!hasRootAccess && gainRootAccessIfPossible) {
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
	}).filter(s => s).filter(s => s !== 'darkweb')
	.sort((a, b) => ns.getServerMaxRam(b) - ns.getServerMaxRam(a));
}

export function getStopableServers(ns, currentServer, previousServer) {
	var servers = ns.scan(currentServer).filter(s => s != previousServer);
	if (!servers || servers.length === 0) return [];
	return servers.flatMap((s) => {
		var hasRootAccess = ns.hasRootAccess(s);

		if (!hasRootAccess) { return };
		return [s, ...getStopableServers(ns, s, currentServer)];
	}).filter(s => s);
}

/** @param {NS} ns */
export function getBestServersForHacking(ns, startableServers, myHackingLevel) {
	const eligibleServers = startableServers.filter(server => {
		var requiredHackingLevel = ns.getServerRequiredHackingLevel(server);
		return requiredHackingLevel < myHackingLevel / 3 && ns.getServerMaxMoney(server) > 0;
	});

	const numberOfServersToHack = Math.min(Math.ceil(startableServers.length / 10), eligibleServers.length);

	const orderedServers = eligibleServers.sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a));
	return orderedServers.slice(0, numberOfServersToHack - 1);
}
