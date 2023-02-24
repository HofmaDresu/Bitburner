import {getStartableServers, getBestServersForHacking, MAX_SINGLE_PROGRAM_RAM, copyFilesToServer} from "/helpers.js";

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("sleep");
	ns.disableLog("scp");
	ns.disableLog("killall");
	ns.disableLog("scan");
	ns.disableLog("getServerMaxRam");
	ns.disableLog("getServerRequiredHackingLevel");
	ns.disableLog("exec");
	ns.disableLog("getHackingLevel");
	ns.disableLog("run");
	let bestServersForHacking = [];
	let startableServers = [];
	while (true) {
		let myHackingLevel = ns.getHackingLevel();
		let newStartableServers = getStartableServers(ns, "home", myHackingLevel, null, true);
		let newBestServersForHacking = getBestServersForHacking(ns, myHackingLevel);
		if (bestServersForHacking.toString() !== newBestServersForHacking.toString() ||
				startableServers.toString() !== newStartableServers.toString()) {
			bestServersForHacking = newBestServersForHacking;
			startableServers = newStartableServers;
			let startableIndex = 0;
			let hackIndex = 0;
			// Hack servers
			while (startableIndex < startableServers.length && hackIndex < bestServersForHacking.length) {
				const server = startableServers[startableIndex];	
				ns.print(`Server ${server}`)			;
                const maxMemory = ns.getServerMaxRam(server);
                const maxRunning = Math.max(Math.floor(maxMemory / MAX_SINGLE_PROGRAM_RAM), 1);
                copyFilesToServer(ns, server);
				ns.killall(server);
                for (let i = 0; i < maxRunning && hackIndex < bestServersForHacking.length; i++) {
                    const serverToHack = bestServersForHacking[hackIndex];
					ns.print(`Start hacking ${serverToHack} on ${server} for monies`)
					ns.run('/money-maker/start-server.js', 1, ...[serverToHack, server]);
					await ns.sleep(1000);
                    hackIndex++;
                }
                startableIndex++;
            }
            hackIndex = 0;
			// Bash money servers with weaken
			while (startableIndex < startableServers.length && hackIndex < bestServersForHacking.length) {
				const server = startableServers[startableIndex];				
                const maxMemory = ns.getServerMaxRam(server);
                const maxRunning = Math.max(Math.floor(maxMemory / MAX_SINGLE_PROGRAM_RAM), 1);
                copyFilesToServer(ns, server);
				ns.killall(server);
                for (let i = 0; i < maxRunning && hackIndex < bestServersForHacking.length; i++) {
                    const serverToHack = bestServersForHacking[hackIndex];
                    ns.print(`Start hacking ${serverToHack} on ${server} for exp 1`)
                    ns.exec('/experience/weaken-server.js', server, 1, serverToHack);
                    hackIndex++;
                }
                startableIndex++;
			};
            // Bash n00dles with weaken
			for (; startableIndex < startableServers.length; startableIndex++) {
				ns.print(`Start hacking n00dles for exp 2`)
				const server = startableServers[startableIndex];
				if (server.indexOf("hacknet") >= 0) continue;
				ns.killall(server);
                copyFilesToServer(ns, server);
				ns.exec('/experience/gain-hack-experience.js', server, 1, "n00dles");
			}
		}
		await ns.sleep(60000);
	}
}
