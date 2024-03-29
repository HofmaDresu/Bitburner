import {getStartableServers, getBestServersForHacking, copyFilesToServer} from "/helpers.js";

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("sleep");
	ns.disableLog("scp");
	ns.disableLog("killall");
	ns.disableLog("scan");
	ns.disableLog("getServerMaxRam");
	ns.disableLog("getServerRequiredHackingLevel");
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
			let index = 0;
			// Hack servers
			for (; index < startableServers.length && index < bestServersForHacking.length; index++) {
				let server = startableServers[index];				
				let serverToHack = bestServersForHacking[index];
				const scriptIsStillRunning = await stopServerIfRetargetNeeded(ns, server, serverToHack);
				if (!scriptIsStillRunning) {
					copyFilesToServer(ns, server);
					ns.print(`Start hacking ${serverToHack} for monies`)
					ns.run('/money-maker/start-server.js', 1, ...[serverToHack, server]);
				}
			};
			// Bash money servers with weaken
			for (; index < startableServers.length && index < bestServersForHacking.length * 2; index++) {
				let server = startableServers[index];	
				ns.killall(server);
				let serverToHack = bestServersForHacking[index - bestServersForHacking.length];			
				const experienceProcesses = ns.ps(server).filter(process => process.filename === '/experience/gain-hack-experience.js');
				if(!experienceProcesses || experienceProcesses.length === 0) {
					ns.print(`Start hacking ${serverToHack} for exp 1`)
					copyFilesToServer(ns, server);
					ns.exec('/experience/gain-hack-experience.js', server, 1, serverToHack);
				}
			};
			for (; index < startableServers.length; index++) {
				ns.print(`Start hacking n00dles for exp 2`)
				const server = startableServers[index];
				ns.killall(server);
                copyFilesToServer(ns, server);
				ns.exec('/experience/gain-hack-experience.js', server, 1, "n00dles");
			}
		}
		await ns.sleep(60000);
	}
}

/** @param {NS} ns */
async function stopServerIfRetargetNeeded(ns, server, bestServerForHacking) {
	let moneyMakerProcess = ns.ps(server).filter(process => process.filename === '/money-maker/money-maker-v3.js' || process.filename === '/money-maker/money-maker-v2.js' || process.filename === '/money-maker/money-maker.js');
	if (!moneyMakerProcess || moneyMakerProcess.length === 0) return false;
	if (bestServerForHacking && moneyMakerProcess[0].args.includes(bestServerForHacking)) return true;
	ns.killall(server);
	return false
}
