import {stockToServers} from "/stocks/helpers.js";

/** @param {NS} ns */
export function getStartableServers(ns, currentServer, myHackingLevel, previousServer, gainRootAccessIfPossible = false) {
	const servers = ns.scan(currentServer).filter(s => s != previousServer);
	if (!servers || servers.length === 0) return [];
	return servers.flatMap((s) => {
		if (gainRootAccessIfPossible) crackServerIfNeededAndPossible(ns, s, myHackingLevel);

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
		if (requiredHackingLevel > myHackingLevel) { return []; }
		let requiredPorts = ns.getServerNumPortsRequired(server);
		if (requiredPorts > hackablePorts) { return []; }
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
	const stockSymbols = Object.keys(stockToServers);
	const stockServers = stockSymbols.flatMap(ss => stockToServers[ss]);

	const eligibleServers = getHackableServers(ns, "home").filter(server => {
		var requiredHackingLevel = ns.getServerRequiredHackingLevel(server);
		return requiredHackingLevel <= Math.max(1, myHackingLevel);
	}).filter(server => !stockServers.includes(server));


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

/** @param {NS} ns */
export async function growToTargetPercent(ns, host, targetPercent, impactStock) {
	const maxMoney = ns.getServerMaxMoney(host);
	const targetMoney = maxMoney * targetPercent * 1.0;
	let currentMoney = ns.getServerMoneyAvailable(host);

	if (!ns.fileExists('Formulas.exe', 'home')) {
		while (currentMoney < targetMoney) {
			await weakenToMin(ns, host);
			await ns.grow(host, {stock: impactStock});		
			currentMoney = ns.getServerMoneyAvailable(host);
		}
		return;
	}

	const maxThreads = ns.getRunningScript().threads;
	
	let growthNeededToTarget = targetMoney / currentMoney;
	while (currentMoney < targetMoney) {
		const threadsToUse =calculateThreadsForGrowToTargetPercent(ns, host, targetPercent, maxThreads);
		await weakenToMin(ns, host);
		await ns.grow(host, {stock: impactStock, threads: threadsToUse});
		currentMoney = ns.getServerMoneyAvailable(host);
		growthNeededToTarget = targetMoney / currentMoney;
		await ns.sleep(50);
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

/** @param {NS} ns */
export async function hackToTargetPercent(ns, host, targetPercent, impactStock) {	
	const maxMoney = ns.getServerMaxMoney(host);
	const targetMoney = maxMoney * targetPercent * 1.0;
	let currentMoney = ns.getServerMoneyAvailable(host);
	if (!ns.fileExists('Formulas.exe', 'home')) {
		while (currentMoney > targetMoney) {
			await weakenToMin(ns, host);
			await ns.hack(host, {stock: impactStock});			
			currentMoney = ns.getServerMoneyAvailable(host);
		}
		return;
	}

	const maxThreads = ns.getRunningScript().threads;

	while (currentMoney > targetMoney) {
		const threadsToUse = calculateThreadsForHackToTargetPercent(ns, host, targetPercent, maxThreads);
		await weakenToMin(ns, host);
		await ns.hack(host, {stock: impactStock, threads: threadsToUse});
		currentMoney = ns.getServerMoneyAvailable(host);
		await ns.sleep(50);
	}
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
