import { getBestServerToHack, getConfig, saveConfig, CONFIG_BUY_STOCKS, CONFIG_SPEND_ON_HACKNET, CONFIG_SPEND_ON_SERVERS, getAvailableRam, startScriptOnHomeIfAble} from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    ns.disableLog("scan");
    ns.disableLog("getServerRequiredHackingLevel");
    ns.disableLog("getServerMaxMoney");
    ns.killall("home");
    let stillMoreToStart = true;

    while(stillMoreToStart) {
        let started = false;
        setStartupConfig(ns);

        started = startScriptOnHomeIfAble(ns, "control/homeRunner.js");
        if (!started) {
            await ns.sleep(10000);
            continue;
        }

        await ns.sleep(1000);
        stillMoreToStart = false;
    }
}

/** @param {NS} ns */
function setStartupConfig(ns) {
    const config = getConfig(ns);
    // TODO only start things if multiplier is high enough
    config[CONFIG_BUY_STOCKS] = true;
    config[CONFIG_SPEND_ON_HACKNET] = true;
    config[CONFIG_SPEND_ON_SERVERS] = true;
    saveConfig(ns, config);
}