/** @param {NS} ns */
export async function main(ns) {
    while(true) {        
        startScriptIfAvailableRam(ns, '/money-maker/run-money-maker-v2.js');
        startScriptIfAvailableRam(ns, '/contracts/complete-coding-contracts.js');
        startScriptIfAvailableRam(ns, '/upgraders/purchase-server.js');
        startScriptIfAvailableRam(ns, '/upgraders/purchase-programs.js');
        startScriptIfAvailableRam(ns, '/upgraders/upgrade-home-server.js');
        if (ns.gang.inGang()) {
            startScriptIfAvailableRam(ns, '/gang/run-gang.js');
        }
        startScriptIfAvailableRam(ns, '/upgraders/purchase-hacknet-nodes.js') 
        startScriptIfAvailableRam(ns, '/corporations/run-company.js');
        startScriptIfAvailableRam(ns, '/stocks/stock-watcher.js');
        startScriptIfAvailableRam(ns, '/stocks/activate-purchases.js');
        startScriptIfAvailableRam(ns, '/stocks/play-the-market.js');
        startScriptIfAvailableRam(ns, '/experience/gain-intelligence.js');
        ns.sleep(10_000);
    }
}

/** @param {NS} ns */
function startScriptIfAvailableRam(ns, script) {
    const availableRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");
    const scriptRam = ns.getScriptRam(script);
    const isScriptRunning = ns.scriptRunning(script, "home");

    if (scriptRam < availableRam && !isScriptRunning) {
        ns.rsun(script);
    }
}
