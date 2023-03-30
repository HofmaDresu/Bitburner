import {copyFilesToServer, MONEY_MAKER_SCRIPTS} from 'helpers';

/** @param {NS} ns */
export async function main(ns) {
	var targetServer = arguments[0].args[0];
	var server = arguments[0].args[1];
	var hasRootAccess = ns.hasRootAccess(server);
	if (!hasRootAccess) return;
	copyFilesToServer(ns, server);
	startBestScript(ns, targetServer, server);
}

function startBestScript(ns, targetServer, server) {
	const availableMemory = ns.getServerMaxRam(server);
	let scriptToRun = null;
	let scriptToRunRam = null;
	// Advanced scripts only need one thread since they farm out work cleverly
	let idealThreads = 1;
	// Make sure we can run scripts + their subscripts
	const scriptMemoryMap = MONEY_MAKER_SCRIPTS
		.map(s => ({script: s, ram: getFullScriptRam(ns, s)}))
		.filter(sr => sr.ram < availableMemory)
		.sort((a, b) => b.ram - a.ram);

	if (scriptMemoryMap.length) {
		scriptToRun = scriptMemoryMap[0].script;
		scriptToRunRam = scriptMemoryMap[0].ram;
	}
	
	// Most basic script should be run at max power
	if (scriptToRun === '/money-maker/money-maker.js') {
		scriptToRunRam = getFullScriptRam(ns, scriptToRun);
		idealThreads = Math.floor(availableMemory / scriptToRunRam);	
	}

	const maxThreads = Math.floor(availableMemory / scriptToRunRam);	
	if (maxThreads > 0) ns.exec(scriptToRun, server, idealThreads, targetServer);
}

// method to get full ram cost of money maker scripts including the max of hack/weaken/grow
function getFullScriptRam(ns, script) {
	let ram = ns.getScriptRam(script);
	if (script !== '/money-maker/money-maker.js') {
		ram += Math.max(ns.getScriptRam('/experience/hack-server.js'), ns.getScriptRam('/experience/weaken-server.js'), ns.getScriptRam('/experience/grow-server.js'));
	}
	return ram;
}