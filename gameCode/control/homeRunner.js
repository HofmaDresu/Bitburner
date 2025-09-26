import { startScriptOnHomeIfAble, killScriptIfRunningOnHome, getConfig, saveConfig, CONFIG_SPEND_ON_HACKNET, CONFIG_SPEND_ON_SERVERS, getBestServerToHack, nukeServer, getServers } from "helpers";
import { canTradeStocks, iOwnStocks } from "stocks/helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    ns.disableLog("scan");
    ns.disableLog("getServerRequiredHackingLevel");
    ns.disableLog("getServerMaxMoney");
    ns.disableLog("getServerMaxRam");
    ns.disableLog("getServerUsedRam");
    // TODO: improve with singularity
    // buy TOR / files when able
    // start at uni until hack >= 10?
    // next create BruteSSH (or buy)
    // next rob store until hacking >= 25
    // next create AutoLink (or buy)
    // next rob store until hacking >= 75
    // next create DeepscankV1 (or buy)
    // next rob store hack >= 100
    // next create FTPCrack (or buy)
    // next rob store until $ from hacking > 1_000_000

    // TODO: augments
    // get Sector12 cashroot starter kit
    // get Tian Di Hui Neuroreceptor Management Implant
    while (true) {
        const config = getConfig(ns);

        crackServers(ns);
        purchaseThings(ns);

        const allRunnablesStared = startOrStopScripts(ns, config);

        if (allRunnablesStared) {
            startScriptOnHomeIfAble(ns, "control/makeMoneyFromTarget.js", [getBestServerToHack(ns)]);
        }

        await ns.sleep(10_000);
    }
}

/** @param {NS} ns */
function crackServers(ns) {    
    const servers = getServers(ns);
    for (let server of servers) {
        nukeServer(ns, server);
        // TODO: backdoor server in singularity
    };
}

/** @param {NS} ns */
function purchaseThings(ns) {
}

/** @param {NS} ns */
function startOrStopScripts(ns, config) {    
    let higherPriorityItemsStarted = true;
    const moneySources = ns.getMoneySources().sinceInstall;
    const shouldManipulateMarket = canTradeStocks(ns) && iOwnStocks(ns);

    // TODO: restart makeMoneyFromTarget and servers when new best target exists
    // TODO: run something more primitave on n00dles

    if(higherPriorityItemsStarted && !shouldManipulateMarket) {
        killScriptIfRunningOnHome(ns, "control/makeServersManipulateMarket.js")
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "control/makeServersSelfHack.js");
    }

    if (config[CONFIG_SPEND_ON_HACKNET] && moneySources.hacknet > 1_000_000 && moneySources.hacknet * 100 <= moneySources.hacking) {
        config[CONFIG_SPEND_ON_HACKNET] = false;
        saveConfig(ns, config);
    }
    if (config[CONFIG_SPEND_ON_HACKNET] && higherPriorityItemsStarted) {
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "hacknet/purchaseNodes.js");
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "hacknet/upgradeNodes.js");
    } else {
        killScriptIfRunningOnHome(ns, "hacknet/purchaseNodes.js")
        killScriptIfRunningOnHome(ns, "hacknet/upgradeNodes.js")
    }

    if (config[CONFIG_SPEND_ON_SERVERS] && higherPriorityItemsStarted) {
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "servers/purchaseServers.js");
    } else {
        killScriptIfRunningOnHome(ns, "servers/purchaseServers.js")
    }
    if(higherPriorityItemsStarted) {
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "stocks/trackStockValues.js");
    }
    if(higherPriorityItemsStarted) {
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "stocks/playTheMarket.js");
    }

    if(higherPriorityItemsStarted && shouldManipulateMarket) {
        killScriptIfRunningOnHome(ns, "control/makeServersSelfHack.js")
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "control/makeServersManipulateMarket.js");
    }

    return higherPriorityItemsStarted;
}