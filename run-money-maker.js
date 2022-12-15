import {getStartableServers, getBestServersForHacking} from "/helpers.js";

/** @param {NS} ns */
export async function main(ns) {
	let bestServersForHacking = [];
	while (true) {
		let myHackingLevel = ns.getHackingLevel();
		let startableServers = getStartableServers(ns, "home", myHackingLevel, null, true);
		let newBestServersForHacking = getBestServersForHacking(ns, startableServers, myHackingLevel);
		if (bestServersForHacking.toString() !== newBestServersForHacking.toString()) {
			bestServersForHacking = newBestServersForHacking;
			for (let index = 0; index < startableServers.length; index++) {
				let server = startableServers[index];				
				let serverToHack = bestServersForHacking[index % bestServersForHacking.length];
				await stopServerIfRetargetNeeded(ns, server, serverToHack);
				ns.run('start-server.js', 1, ...[serverToHack, server]);
			};
		}
		await ns.sleep(60000);
	}
}

async function stopServerIfRetargetNeeded(ns, server, bestServerForHacking) {
	let moneyMakerProcess = await ns.ps(server).filter(process => process.filename === 'money-maker.js');
	if (!moneyMakerProcess || moneyMakerProcess.length === 0) return;
	if (moneyMakerProcess[0].args.includes(bestServerForHacking)) return;
	await ns.killall(server);
}
