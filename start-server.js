/** @param {NS} ns */
export async function main(ns) {
	var targetServer = arguments[0].args[0];
	var server = arguments[0].args[1];
	var script = '/money-maker/money-maker-v2.js';
	var scriptRam = ns.getScriptRam(script);
	var hasRootAccess = ns.hasRootAccess(server);
	if (!hasRootAccess) return;
	ns.scp('helpers.js', server);
	ns.scp('/stocks/helpers.js', server);
	ns.scp(script, server);		
	ns.scp('/money-maker/grow-server.js', server);
	ns.scp('/money-maker/hack-server.js', server);
	ns.scp('/money-maker/weaken-server.js', server);
	var availableMemory = ns.getServerMaxRam(server);
	var maxThreads = Math.floor(availableMemory / scriptRam);	
	if (maxThreads > 0) ns.exec(script, server, 1, targetServer);
}
