import {getMaxContractSolverRam, getNodeMultipliers} from 'helpers';
import { MAX_MANUAL_HACKS, MANUAL_HACK_SCRIPT } from 'experience/gain-intelligence';

/** @param {NS} ns */
export async function main(ns) {
    const multipliers = getNodeMultipliers(ns);
    while(true) {        
        startScriptIfAvailableRam(ns, '/money-maker/run-money-maker-v2.js');
        //startScriptIfAvailableRam(ns, '/upgraders/upgrade-home-server.js');
        startScriptIfAvailableRam(ns, '/contracts/complete-coding-contracts.js');
        //startScriptIfAvailableRam(ns, '/upgraders/purchase-programs.js');
        if ((multipliers.ScriptHackMoney > .5 && multipliers.ScriptHackMoneyGain > .5) || ns.getServerMaxRam("home") > 3_000) {
            //startScriptIfAvailableRam(ns, '/upgraders/purchase-server.js');
        }
        //startScriptIfAvailableRam(ns, '/gang/run-gang.js');
        // TODO: if hacking is too weak, start hacknet servers
        //startScriptIfAvailableRam(ns, '/upgraders/purchase-hacknet-servers.js');
        //startScriptIfAvailableRam(ns, '/hacknet/run-hacknet.js');
        startScriptIfAvailableRam(ns, '/stocks/stock-watcher.js');
        startScriptIfAvailableRam(ns, '/stocks/activate-purchases.js');
        startScriptIfAvailableRam(ns, '/stocks/play-the-market.js');
        //startScriptIfAvailableRam(ns, '/corporations/run-company.js');
        startScriptIfAvailableRam(ns, '/experience/gain-intelligence.js');
        if (allScriptsAreRunning(ns)) {
            //TODO: This needs to adjust for increases in RAM
            //startScriptIfAvailableRam(ns, '/experience/gain-hack-experience.js');
        }
        await ns.sleep(10_000);
    }
}

/** @param {NS} ns */
function startScriptIfAvailableRam(ns, script) {
    const maxContractSolverRam = getMaxContractSolverRam(ns);
    const availableRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - maxContractSolverRam - ns.getScriptRam("/money-maker/start-server.js");
    const scriptRam = ns.getScriptRam(script);
    const isScriptRunning = ns.scriptRunning(script, "home");

    if (scriptRam < availableRam && !isScriptRunning) {
        ns.run(script);
    }
}

// NOTE: Skips purchase programs and purchase server because those can finish
/** @param {NS} ns */
function allScriptsAreRunning(ns) {
    return ns.scriptRunning('/money-maker/run-money-maker-v2.js', "home") &&
        //ns.scriptRunning('/upgraders/upgrade-home-server.js', "home") &&
        ns.scriptRunning('/contracts/complete-coding-contracts.js', "home") &&
        //ns.scriptRunning('/gang/run-gang.js', "home") &&
        //ns.scriptRunning('/upgraders/purchase-hacknet-servers.js', "home") &&
        //ns.scriptRunning('/hacknet/run-hacknet.js', "home") &&
        ns.scriptRunning('/stocks/stock-watcher.js', "home") &&
        ns.scriptRunning('/stocks/play-the-market.js', "home") &&
        //ns.scriptRunning('/corporations/run-company.js', "home") &&
        ns.scriptRunning('/experience/gain-intelligence.js', "home") &&
        ns.ps("home").filter(ps => ps.filename === MANUAL_HACK_SCRIPT).length === MAX_MANUAL_HACKS;
}