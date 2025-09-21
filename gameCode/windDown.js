import { getConfig, saveConfig, CONFIG_BUY_STOCKS } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    setWindDownConfig(ns);
    killScriptIfRunning(ns, "servers/purchaseServers.js");
    killScriptIfRunning(ns, "hacknet/purchaseNodes.js");
    killScriptIfRunning(ns, "hacknet/upgradeNodes.js");
}

function killScriptIfRunning(ns, script) {
    if(ns.scriptRunning(script, "home")) {
        ns.scriptKill(script, "home");
    }
}

/** @param {NS} ns */
function setWindDownConfig(ns) {
    const config = getConfig(ns);
    config[CONFIG_BUY_STOCKS] = false;
    saveConfig(ns, config);
}