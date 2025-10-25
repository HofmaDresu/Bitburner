import { getConfig, saveConfig, CONFIG_BUY_STOCKS, CONFIG_SPEND_ON_HACKNET, CONFIG_SPEND_ON_SERVERS, CONFIG_SHARE_ALL_MEMORY, CONFIG_NODE_MULTIPLIERS, startScriptOnHomeIfAble} from "helpers";
import { STOCK_HISTORY_FILE_NAME } from "stocks/helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    ns.disableLog("scan");
    ns.disableLog("getServerRequiredHackingLevel");
    ns.disableLog("getServerMaxMoney");
    ns.killall("home");
    
    setStartupConfig(ns);
    // Reset stock values
    ns.write(STOCK_HISTORY_FILE_NAME, JSON.stringify({}), "w");

    if(ns.getServerMaxRam("home") < 128) {
        ns.spawn("control/homeRunnerLowRamSingularity.js",  {threads: 1, spawnDelay: 500});
    } else {
        if(!startScriptOnHomeIfAble(ns, "control/homeRunnerSingularity.js")) {
            startScriptOnHomeIfAble(ns, "control/homeRunner.js");
        }
    }
}

/** @param {NS} ns */
function setStartupConfig(ns) {
    const config = getConfig(ns);
    const mulitpliers = ns.getBitNodeMultipliers();
    config[CONFIG_BUY_STOCKS] = true;
    config[CONFIG_SPEND_ON_HACKNET] = mulitpliers.HacknetNodeMoney >= .5;
    config[CONFIG_SPEND_ON_SERVERS] = mulitpliers.ScriptHackMoney > 0 && mulitpliers.ScriptHackMoneyGain > 0 && mulitpliers.PurchasedServerLimit > 0 && mulitpliers.ServerMaxMoney > 0;
    config[CONFIG_SHARE_ALL_MEMORY] = false;
    config[CONFIG_NODE_MULTIPLIERS] = mulitpliers;
    saveConfig(ns, config);
}