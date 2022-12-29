const MONEY_MAKER_SCRIPTS = ['/money-maker/money-maker.js', '/money-maker/money-maker-v2.js'];

/** @param {NS} ns */
export async function main(ns) {
	var targetServer = arguments[0].args[0];
	var server = arguments[0].args[1];
	var hasRootAccess = ns.hasRootAccess(server);
	if (!hasRootAccess) return;
	ns.scp('helpers.js', server);
	ns.scp('/stocks/helpers.js', server);
	ns.scp('/money-maker/grow-server.js', server);
	ns.scp('/money-maker/hack-server.js', server);
	ns.scp('/money-maker/weaken-server.js', server);
	MONEY_MAKER_SCRIPTS.forEach(s => ns.scp(s, server));
	startBestScript(ns, targetServer, server);
}

function startBestScript(ns, targetServer, server) {
	const availableMemory = ns.getServerMaxRam(server);
	let scriptToRun = null;
	let scriptToRunRam = null;
	// Advanced scripts only need one thread since they farm out work cleverly
	let idealThreads = 1;
	const scriptMemoryMap = MONEY_MAKER_SCRIPTS
		.map(s => ({script: s, ram: ns.getScriptRam(s)}))
		.filter(sr => sr.ram < availableMemory)
		.sort((a, b) => b.ram - a.ram);

	if (scriptMemoryMap.length) {
		scriptToRun = scriptMemoryMap[0].script;
		scriptToRunRam = scriptMemoryMap[0].ram;
	}
	
	// Without Formulas, run our most basic script and max power
	if (!ns.fileExists('Formulas.exe', 'home')) {
		scriptToRun = '/money-maker/money-maker.js';
		scriptToRunRam = ns.getScriptRam(scriptToRun);
		idealThreads = Math.floor(availableMemory / scriptToRunRam);	
	}

	const maxThreads = Math.floor(availableMemory / scriptToRunRam);	
	if (maxThreads > 0) ns.exec(scriptToRun, server, idealThreads, targetServer);
}