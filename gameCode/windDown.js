import { getConfig, saveConfig, CONFIG_BUY_STOCKS, CONFIG_SPEND_ON_HACKNET, CONFIG_SPEND_ON_SERVERS, CONFIG_SHARE_ALL_MEMORY, killScriptIfRunningOnHome } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    setWindDownConfig(ns);
    killScriptIfRunningOnHome(ns, "servers/purchaseServers.js");
    killScriptIfRunningOnHome(ns, "hacknet/purchaseNodes.js");
    killScriptIfRunningOnHome(ns, "hacknet/upgradeNodes.js");
}

/** @param {NS} ns */
function setWindDownConfig(ns) {
    const shareMemory = ns.flags([["shareMemory", false]])["shareMemory"];
    const config = getConfig(ns);
    config[CONFIG_BUY_STOCKS] = false;
    config[CONFIG_SPEND_ON_HACKNET] = false;
    config[CONFIG_SPEND_ON_SERVERS] = false;
    config[CONFIG_SHARE_ALL_MEMORY] = shareMemory;
    saveConfig(ns, config);
}