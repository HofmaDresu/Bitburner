import { startScriptOnHomeIfAble, killScriptIfRunningOnHome, getConfig, saveConfig, CONFIG_SPEND_ON_HACKNET, CONFIG_SPEND_ON_SERVERS, CONFIG_SHARE_ALL_MEMORY, getBestServerToHack } from "helpers";
import { canTradeStocks, iOwnStocks } from "stocks/helpers";
import { crackServers } from "control/helpers";
import advanceThroughHacking from "control/advanceThroughHacking";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("disableLog");
    ns.disableLog("sleep");
    ns.disableLog("scan");
    ns.disableLog("getServerRequiredHackingLevel");
    ns.disableLog("getServerMaxMoney");
    ns.disableLog("getServerMaxRam");
    ns.disableLog("getServerUsedRam");

    // TODO: augments
    // get Sector12 cashroot starter kit
    // get Tian Di Hui Neuroreceptor Management Implant
    while (true) {
        const config = getConfig(ns);

        await earlyGameSetUp(ns);
        //TODO: break out into its own script for async work
        await crackServers(ns);
        purchaseThings(ns);
        joinNonCityFactions(ns);
        advanceThroughHacking(ns);

        const allRunnablesStared = startOrStopScripts(ns, config);

        if (allRunnablesStared && !config[CONFIG_SHARE_ALL_MEMORY]) {
            startScriptOnHomeIfAble(ns, "control/makeMoneyFromTarget.js", [getBestServerToHack(ns)]);
        }


        await ns.sleep(10_000);
    }
}

/** @param {NS} ns */
async function earlyGameSetUp(ns) {
    const player = ns.getPlayer();
    const hackSkill = player.skills.hacking;
    const moneySources = ns.getMoneySources().sinceInstall;
    const currentWork = ns.singularity.getCurrentWork();
    //TODO: only focus if we don't have Neuroreceptor Management Implant

    if (hackSkill <= 10) {
        if(currentWork?.type !== "CLASS") {
            ns.singularity.universityCourse("rothman university", "Stucy Computer Science", true);
        }
    } else if (hackSkill <= 50) {
        if(currentWork?.type !== "CRIME") {
            ns.singularity.commitCrime("Rob Store", true);
        }
    } else if (!ns.fileExists("BruteSSH.exe", "home")) {
        if(currentWork?.type !== "CREATE_PROGRAM") {
            ns.singularity.createProgram("BruteSSH.exe", true);
        }
    } else if (hackSkill <= 100) {
        if(currentWork?.type !== "CLASS") {
            ns.singularity.commitCrime("Rob Store", true);
        }
    } else if (!ns.fileExists("FTPCrack.exe", "home")) {
        if(currentWork?.type !== "CREATE_PROGRAM") {
            ns.singularity.createProgram("FTPCrack.exe", true);
        }
    } else if (moneySources.hacking < 1_000_000) {
        if(currentWork?.type !== "CRIME") {
            ns.singularity.commitCrime("Rob Store", true);
        }
    } else if (!currentWork) {
        // TODO: something, something, check stats and Homicide or Assassination if good enough
        // ns.singularity.commitCrime("Rob Store", false);
        ns.singularity.commitCrime("Homicide", false);
    }
}


/** @param {NS} ns */
function joinNonCityFactions(ns) {
    const factionInvites = ns.singularity.checkFactionInvitations();
    const cityFactions = ["Sector-12", "Chongqing", "New Tokyo", "Ishima", "Aevum", "Volhaven"];
    const nonCityFactionInvites = factionInvites.filter((f) => cityFactions.indexOf(f) === -1);

    nonCityFactionInvites.forEach((f) => ns.singularity.joinFaction(f));
}

/** @param {NS} ns */
function purchaseThings(ns) {
    ns.singularity.purchaseTor();
    ns.singularity.purchaseProgram("BruteSSH.exe");
    ns.singularity.purchaseProgram("FTPCrack.exe");
    ns.singularity.purchaseProgram("relaySMTP.exe");
    ns.singularity.purchaseProgram("HTTPWorm.exe");
    ns.singularity.purchaseProgram("SQLInject.exe");
    ns.singularity.purchaseProgram("DeepscanV2.exe");
    ns.singularity.purchaseProgram("AutoLink.exe");
    //ns.singularity.purchaseProgram("Formulas.exe");
    ns.singularity.upgradeHomeRam();
    ns.singularity.upgradeHomeCores();
}

/** @param {NS} ns */
function startOrStopScripts(ns, config) {    
    let higherPriorityItemsStarted = true;
    const moneySources = ns.getMoneySources().sinceInstall;
    const shouldManipulateMarket = canTradeStocks(ns) && iOwnStocks(ns);

    // TODO: restart makeMoneyFromTarget and servers when new best target exists
    // TODO: run something more primitave on n00dles

    if(higherPriorityItemsStarted && !shouldManipulateMarket) {
        killScriptIfRunningOnHome(ns, "control/makeServersManipulateMarket.js");
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "control/makeServersSelfHack.js");
    }

    if (config[CONFIG_SPEND_ON_HACKNET] && moneySources["hacknet"] > 1_000_000 && moneySources["hacknet"] * 100 <= moneySources.hacking) {
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
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "servers/purchaseServers.js");
    } else {
        killScriptIfRunningOnHome(ns, "servers/purchaseServers.js");
    }
    if(higherPriorityItemsStarted) {
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "stocks/trackStockValues.js");
    }
    if(higherPriorityItemsStarted) {
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "stocks/playTheMarket.js");
    }

    if(higherPriorityItemsStarted && shouldManipulateMarket) {
        killScriptIfRunningOnHome(ns, "control/makeServersSelfHack.js");
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "control/makeServersManipulateMarket.js");
    }

    if(higherPriorityItemsStarted && config[CONFIG_SHARE_ALL_MEMORY]) {
        killScriptIfRunningOnHome(ns, "control/makeMoneyFromTarget.js");
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "factions/shareAllMemory.js");
    }

    if(higherPriorityItemsStarted) {
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "IPvGO/playGames.js");
    }

    return higherPriorityItemsStarted;
}