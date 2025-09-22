import { getConfig, saveConfig, CONFIG_BUY_STOCKS, killScriptIfRunningOnHome } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    setWindDownConfig(ns);
    killScriptIfRunningOnHome(ns, "servers/purchaseServers.js");
    killScriptIfRunningOnHome(ns, "hacknet/purchaseNodes.js");
    killScriptIfRunningOnHome(ns, "hacknet/upgradeNodes.js");
}

/** @param {NS} ns */
function setWindDownConfig(ns) {
    const config = getConfig(ns);
    config[CONFIG_BUY_STOCKS] = false;
    saveConfig(ns, config);
}