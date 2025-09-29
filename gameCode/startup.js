import { getConfig, saveConfig, CONFIG_BUY_STOCKS, CONFIG_SPEND_ON_HACKNET, CONFIG_SPEND_ON_SERVERS, CONFIG_SHARE_ALL_MEMORY, startScriptOnHomeIfAble} from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    ns.disableLog("scan");
    ns.disableLog("getServerRequiredHackingLevel");
    ns.disableLog("getServerMaxMoney");
    ns.killall("home");
    
    setStartupConfig(ns);

    if(ns.getServerMaxRam("home") <= 64) {
        startScriptOnHomeIfAble(ns, "control/homeRunnerLowRam.js");
    } else {
        if(!startScriptOnHomeIfAble(ns, "control/homeRunnerSingularity.js")) {
            startScriptOnHomeIfAble(ns, "control/homeRunner.js");
        }
    }
}

/** @param {NS} ns */
function setStartupConfig(ns) {
    const config = getConfig(ns);
    // TODO only start things if multiplier is high enough
    config[CONFIG_BUY_STOCKS] = true;
    config[CONFIG_SPEND_ON_HACKNET] = true;
    config[CONFIG_SPEND_ON_SERVERS] = true;
    config[CONFIG_SHARE_ALL_MEMORY] = false;
    saveConfig(ns, config);
}