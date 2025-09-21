import { getBestServerToHack, getConfig, saveConfig, CONFIG_BUY_STOCKS } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    setWindDownConfig();
    ns.scriptKill("purchaseServers", "home");
    ns.scriptKill("purchaseNodes", "home");
    ns.scriptKill("upgradeNodes", "home");
    ns.scriptKill("playTheMarket", "home");
}

/** @param {NS} ns */
function setWindDownConfig(ns) {
    const config = getConfig(ns);
    config[CONFIG_BUY_STOCKS] = false;
    saveConfig(config);
}