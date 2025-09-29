import { startScriptOnHomeIfAble, killScriptIfRunningOnHome, getConfig, saveConfig, CONFIG_SPEND_ON_HACKNET, CONFIG_SPEND_ON_SERVERS, nukeServer, getServers } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    ns.disableLog("scan");
    ns.disableLog("getServerRequiredHackingLevel");
    ns.disableLog("getServerMaxMoney");
    ns.disableLog("getServerMaxRam");
    ns.disableLog("getServerUsedRam");
    while (true) {
        const config = getConfig(ns);

        crackServers(ns);

        const allRunnablesStared = startOrStopScripts(ns, config);

        if (allRunnablesStared) {
            startScriptOnHomeIfAble(ns, "control/makeMoneyFromTarget.js", ["n00dles"]);
        }

        await ns.sleep(10_000);
    }
}

/** @param {NS} ns */
function crackServers(ns) {    
    const servers = getServers(ns);
    for (let server of servers) {
        nukeServer(ns, server);
    };
}

/** @param {NS} ns */
function startOrStopScripts(ns, config) {    
    let higherPriorityItemsStarted = true;
    const moneySources = ns.getMoneySources().sinceInstall;


    if(higherPriorityItemsStarted) {
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "control/makeServersHackN00dles.js");
    }

    if (config[CONFIG_SPEND_ON_HACKNET] && moneySources["hacknet"] > 100_000) {
        config[CONFIG_SPEND_ON_HACKNET] = false;
        saveConfig(ns, config);
    }
    if (config[CONFIG_SPEND_ON_HACKNET] && higherPriorityItemsStarted) {
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "hacknet/purchaseNodes.js");
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "hacknet/upgradeNodes.js");
    } else {
        killScriptIfRunningOnHome(ns, "hacknet/purchaseNodes.js");
        killScriptIfRunningOnHome(ns, "hacknet/upgradeNodes.js");
    }

    if (config[CONFIG_SPEND_ON_SERVERS] && higherPriorityItemsStarted) {
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "servers/purchaseServers8gb.js");
    } else {
        killScriptIfRunningOnHome(ns, "servers/purchaseServers.js");
    }

    return higherPriorityItemsStarted;
}