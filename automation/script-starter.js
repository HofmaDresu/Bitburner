import {getMaxContractSolverRam} from 'helpers';

/** @param {NS} ns */
export async function main(ns) {
    const multipliers = ns.getBitNodeMultipliers();
    while(true) {        
        startScriptIfAvailableRam(ns, '/money-maker/run-money-maker-v2.js');
        startScriptIfAvailableRam(ns, '/upgraders/upgrade-home-server.js');
        startScriptIfAvailableRam(ns, '/contracts/complete-coding-contracts.js');
        startScriptIfAvailableRam(ns, '/upgraders/purchase-programs.js');
        if ((multipliers.ScriptHackMoney > .5 && multipliers.ScriptHackMoneyGain > .5) || ns.getServerMaxRam("home") > 3_000) {
            startScriptIfAvailableRam(ns, '/upgraders/purchase-server.js');
        }
        // TODO: lower karma if crime money multiplier is good enough?
        // TODO: Move gang API usage to gang file
        if (ns.gang.inGang()) {
            startScriptIfAvailableRam(ns, '/gang/run-gang.js');
        } else if (ns.heart.break() < -54_000) {
            //TODO: make sure we're in slum snakes
            ns.gang.createGang("Slum Snakes");
        }
        startScriptIfAvailableRam(ns, '/upgraders/purchase-hacknet-servers.js');
        startScriptIfAvailableRam(ns, '/hacknet/run-hacknet.js');
        // TODO: spend hashes
        startScriptIfAvailableRam(ns, '/stocks/stock-watcher.js');
        startScriptIfAvailableRam(ns, '/stocks/activate-purchases.js');
        startScriptIfAvailableRam(ns, '/stocks/play-the-market.js');
        startScriptIfAvailableRam(ns, '/corporations/run-company.js');
        startScriptIfAvailableRam(ns, '/experience/gain-intelligence.js');
        await ns.sleep(10_000);
    }
}

/** @param {NS} ns */
function startScriptIfAvailableRam(ns, script) {
    const maxContractSolverRam = getMaxContractSolverRam(ns);
    const availableRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - maxContractSolverRam;
    const scriptRam = ns.getScriptRam(script);
    const isScriptRunning = ns.scriptRunning(script, "home");

    if (scriptRam < availableRam && !isScriptRunning) {
        ns.run(script);
    }
}
