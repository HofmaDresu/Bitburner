import {getStartableServers, getBestServersForHacking} from "/helpers.js";

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
					ns.scp('/money-maker/weaken-server.js', server);
					ns.scp('/experience/gain-hack-experience.js', server);
					ns.exec('/experience/gain-hack-experience.js', server, 1, serverToHack);
				}
			};
			/*
			const halfRemainingServers = Math.ceil((startableServers.length - index) / 2.0);
			const serversToGainExperience = index + halfRemainingServers;
			*/
			// Bash n00dles with weaken for exp
			for (; index < startableServers.length; index++) {
				ns.print(`Start hacking n00dles for exp 2`)
				const server = startableServers[index];
				ns.killall(server);
				ns.scp('/money-maker/weaken-server.js', server);
				ns.scp('/experience/gain-hack-experience.js', server);
				ns.exec('/experience/gain-hack-experience.js', server, 1, "n00dles");
			}/*
			// Run actions to gain intelligence
			for (; index < startableServers.length; index++) {
				const server = startableServers[index]
				ns.killall(server);
				ns.scp('/experience/manual-hack-self.js', server);
				ns.scp('/experience/gain-intelligence.js', server);
				ns.exec('/experience/gain-intelligence.js', server);
			}*/
		}
		await ns.sleep(60000);
	}
}

/** @param {NS} ns */
async function stopServerIfRetargetNeeded(ns, server, bestServerForHacking) {
	let moneyMakerProcess = ns.ps(server).filter(process => process.filename === '/money-maker/money-maker-v2.js' || process.filename === '/money-maker/money-maker.js');
	if (!moneyMakerProcess || moneyMakerProcess.length === 0) return false;
	if (bestServerForHacking && moneyMakerProcess[0].args.includes(bestServerForHacking)) return true;
	ns.killall(server);
	return false
}
