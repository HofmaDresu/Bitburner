/** @param {NS} ns */
export async function main(ns) {
	var targetServer = arguments[0].args[0];
	var servers = arguments[0].args.slice(1);
	var script = 'money-maker.js';
	var scriptRam = ns.getScriptRam(script);
	servers.forEach(server => {
		var hasRootAccess = ns.hasRootAccess(server);
		if (!hasRootAccess) return;
		ns.scp(script, server);
		var availableMemory = ns.getServerMaxRam(server);
		var maxThreads = Math.floor(availableMemory / scriptRam);	
		if (maxThreads > 0) ns.exec(script, server, maxThreads, targetServer);
	});
}
