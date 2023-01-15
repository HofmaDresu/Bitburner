export const MAX_SINGLE_PROGRAM_RAM = 8_192;

/** @param {NS} ns */
export function getStartableServers(ns, currentServer, myHackingLevel, previousServer, gainRootAccessIfPossible = false) {
	const servers = ns.scan(currentServer).filter(s => s != previousServer);
	if (!servers || servers.length === 0) return [];
	return servers.flatMap((s) => {
		if (gainRootAccessIfPossible) crackServerIfNeededAndPossible(ns, s, myHackingLevel);

		
		if (!ns.hasRootAccess(s)) { return []; }

		return [s, ...getStartableServers(ns, s, myHackingLevel, currentServer, gainRootAccessIfPossible)];
	}).filter(s => s).filter(s => ns.getServerMaxRam(s))
	.sort((a, b) => ns.getServerMaxRam(b) - ns.getServerMaxRam(a));
}

export function crackServerIfNeededAndPossible(ns, server, myHackingLevel) {
	let hackablePorts = 0;
	if (ns.fileExists('brutessh.exe')) hackablePorts++;
	if (ns.fileExists('ftpcrack.exe')) hackablePorts++;
	if (ns.fileExists('relaysmtp.exe')) hackablePorts++;
	if (ns.fileExists('httpworm.exe')) hackablePorts++;
	if (ns.fileExists('sqlinject.exe')) hackablePorts++;
	
	let hasRootAccess = ns.hasRootAccess(server);

	if (!hasRootAccess) {
		let requiredHackingLevel = ns.getServerRequiredHackingLevel(server);
		if (requiredHackingLevel > myHackingLevel) { return; }
		let requiredPorts = ns.getServerNumPortsRequired(server);
		if (requiredPorts > hackablePorts) { return; }
		if (ns.fileExists('brutessh.exe')) ns.brutessh(server);
		if (ns.fileExists('ftpcrack.exe')) ns.ftpcrack(server);
		if (ns.fileExists('relaysmtp.exe')) ns.relaysmtp(server);
		if (ns.fileExists('httpworm.exe')) ns.httpworm(server);
		if (ns.fileExists('sqlinject.exe')) ns.sqlinject(server);
		ns.nuke(server);
	}
}

export function getStopableServers(ns, currentServer, previousServer) {
	var servers = ns.scan(currentServer).filter(s => s != previousServer);
	if (!servers || servers.length === 0) return [];
	return servers.flatMap((s) => {
		var hasRootAccess = ns.hasRootAccess(s);

		if (!hasRootAccess) { return };
		return [s, ...getStopableServers(ns, s, currentServer)];
	}).filter(s => s).filter(s => ns.getServerMaxRam(s));
}

export const hackedServersDbFileName = "/hacked-servers-db.txt";

/** @param {NS} ns */
export function getHackableServers(ns, currentServer, previousServer) {
	var servers = ns.scan(currentServer).filter(s => s != previousServer);
	if (!servers || servers.length === 0) return [];
	return servers.flatMap((s) => {
		var hasRootAccess = ns.hasRootAccess(s);

		if (!hasRootAccess) { return };
		return [s, ...getHackableServers(ns, s, currentServer)];
	}).filter(s => s).filter(s => ns.getServerMaxMoney(s));
}

/** @param {NS} ns */
export function getBestServersForHacking(ns, myHackingLevel) {
	const eligibleServers = getHackableServers(ns, "home").filter(server => {
		var requiredHackingLevel = ns.getServerRequiredHackingLevel(server);
		return requiredHackingLevel <= Math.max(1, myHackingLevel);
	});

	const orderedServers = eligibleServers.sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a));
	
	ns.write(hackedServersDbFileName, JSON.stringify(orderedServers), "w");
	return orderedServers;
}

export async function weakenToMin(ns, server) {
	const minSecurityLevel = ns.getServerMinSecurityLevel(server);
	while (await ns.getServerSecurityLevel(server) > minSecurityLevel + 1) {
		await ns.weaken(server);
	}
}

export function calculateThreadsForGrowToTargetPercent(ns, host, targetPercent, maxThreads) {
	const maxMoney = ns.getServerMaxMoney(host);
	const targetMoney = maxMoney * targetPercent * 1.0;
	let currentMoney = ns.getServerMoneyAvailable(host);
	let threadsToUse = 0;
	const player = ns.getPlayer();
	const targetServer = ns.getServer(host);
	const runningServer = ns.getServer();
	
	let growthNeededToTarget = targetMoney / currentMoney;
	while (ns.formulas.hacking.growPercent(targetServer, threadsToUse, player, runningServer.cpuCores) < growthNeededToTarget && threadsToUse < maxThreads) {
		threadsToUse++;
	}
	return threadsToUse;
}

export function calculateThreadsForHackToTargetPercent(ns, host, targetPercent, maxThreads) {
	const maxMoney = ns.getServerMaxMoney(host);
	const targetMoney = maxMoney * targetPercent * 1.0;
	let currentMoney = ns.getServerMoneyAvailable(host);

	let threadsToUse = 0;
	const player = ns.getPlayer();
	const targetServer = ns.getServer(host);
	const hackPercent = ns.formulas.hacking.hackPercent(targetServer, player)
	let hackNeededToTarget = 1 - (targetMoney / currentMoney);
	let threadsNeededForHack = Math.ceil(hackNeededToTarget / hackPercent);
	
	while (threadsToUse < maxThreads && threadsToUse < threadsNeededForHack) {
		threadsToUse++;
	}
	return threadsToUse
}

export async function calculateThreadsToWeakenToMin(ns, host, maxThreads) {
	const cores = ns.getServer().cpuCores;
	const currentSecurity = await ns.getServerSecurityLevel(host);
	const targetSecurity =  ns.getServerMinSecurityLevel(host);

	let threadsToUse = 0;
	
	while (currentSecurity - ns.weakenAnalyze(threadsToUse, cores) > targetSecurity && threadsToUse < maxThreads) {
		threadsToUse++;
	}
	return threadsToUse
}

export const MONEY_MAKER_SCRIPTS = ['/money-maker/money-maker.js', '/money-maker/money-maker-v2.js', '/money-maker/money-maker-v3.js'];

export function copyFilesToServer(ns, hostname) {
	ns.scp('helpers.js', hostname);
	ns.scp('/stocks/helpers.js', hostname);
	ns.scp('/money-maker/grow-server.js', hostname);
	ns.scp('/money-maker/hack-server.js', hostname);
	ns.scp('/money-maker/weaken-server.js', hostname);
	ns.scp('/experience/gain-hack-experience.js', hostname);
	ns.scp('/experience/weaken-server.js', hostname);
	MONEY_MAKER_SCRIPTS.forEach(s => ns.scp(s, hostname));

}