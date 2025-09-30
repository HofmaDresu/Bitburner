import { startScriptOnHomeIfAble, killScriptIfRunningOnHome, getConfig, saveConfig, CONFIG_SPEND_ON_HACKNET, CONFIG_SPEND_ON_SERVERS } from "helpers";
import { crackServers } from "control/helper";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("disableLog");
    ns.disableLog("sleep");
    ns.disableLog("scan");
    ns.disableLog("getServerRequiredHackingLevel");
    ns.disableLog("getServerMaxMoney");
    ns.disableLog("getServerMaxRam");
    ns.disableLog("getServerUsedRam");
    while (true) {
        const config = getConfig(ns);

        await crackServers(ns);
        await earlyGameSetUp(ns);

        const allRunnablesStared = startOrStopScripts(ns, config);

        if (allRunnablesStared) {
            startScriptOnHomeIfAble(ns, "control/makeMoneyFromTarget.js", ["n00dles"]);
        }

        await ns.sleep(10_000);
    }
}

/** @param {NS} ns */
async function earlyGameSetUp(ns) {
    const player = ns.getPlayer();
    const hackSkill = player.skills.hacking;
    const moneySources = ns.getMoneySources().sinceInstall;

    if (hackSkill <= 10) {
        ns.singularity.universityCourse("rothman university", "Stucy Computer Science", true);
    } else if (hackSkill <= 50) {
        ns.singularity.commitCrime("Rob Store", true);
    } else if (!ns.fileExists("BruteSSH.exe", "home")) {
        ns.singularity.createProgram("BruteSSH.exe", true);
    } else if (hackSkill <= 100) {
        ns.singularity.commitCrime("Rob Store", true);
    } else if (!ns.fileExists("FTPCrack.exe", "home")) {
        ns.singularity.createProgram("FTPCrack.exe", true);
    } else if (moneySources.hacking < 1_000_000) {
        ns.singularity.commitCrime("Rob Store", true);
    }
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
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "hacknet/purchaseNodes.js", ["--canUseAllMoney"]);
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "hacknet/upgradeNodes.js", ["--canUseAllMoney"]);
    } else {
        killScriptIfRunningOnHome(ns, "hacknet/purchaseNodes.js");
        killScriptIfRunningOnHome(ns, "hacknet/upgradeNodes.js");
    }

    if (config[CONFIG_SPEND_ON_SERVERS] && higherPriorityItemsStarted) {
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "servers/purchaseServers.js");
    } else {
        killScriptIfRunningOnHome(ns, "servers/purchaseServers.js");
    }

    return higherPriorityItemsStarted;
}