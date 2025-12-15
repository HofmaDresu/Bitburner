import { startScriptOnHomeIfAble, killScriptIfRunningOnHome, getConfig, CONFIG_SPEND_ON_HACKNET, CONFIG_SPEND_ON_SERVERS } from "helpers";
import { crackServersNoBackdoor } from "control/helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("disableLog");
    ns.disableLog("sleep");
    ns.disableLog("nuke");
    ns.disableLog("scan");
    ns.disableLog("getServerRequiredHackingLevel");
    ns.disableLog("getServerMaxMoney");
    ns.disableLog("getServerMaxRam");
    ns.disableLog("getServerUsedRam");
    ns.ui.openTail();
    while (true) {
        const config = getConfig(ns);

        await crackServersNoBackdoor(ns);
        await earlyGameSetUp(ns);

        const allRunnablesStared = startOrStopScripts(ns, config);

        if (allRunnablesStared) {
            startScriptOnHomeIfAble(ns, "control/makeMoneyFromTarget.js", ["n00dles"]);
        }

        purchaseThings(ns);

        // TODO: if home ram > 128 run startup.js (and close this)
        if (ns.getServerMaxRam("home") > 128) {
            ns.spawn("startup.js",  {threads: 1, spawnDelay: 500});
        }
        await ns.sleep(10_000);
    }
}

/** @param {NS} ns */
async function earlyGameSetUp(ns) {
    const player = ns.getPlayer();
    const hackSkill = player.skills.hacking;
    const currentWork = ns.singularity.getCurrentWork();

    if (hackSkill <= 50) {
        if(currentWork?.type !== "CRIME") {
            ns.singularity.commitCrime("Rob Store", true);
        }
    } else if (!ns.fileExists("BruteSSH.exe", "home")) {
        if(currentWork?.type !== "CREATE_PROGRAM") {
            ns.singularity.createProgram("BruteSSH.exe", true);
        }
    } else if (hackSkill <= 100) {
        if(currentWork?.type !== "CRIME") {
            ns.singularity.commitCrime("Rob Store", true);
        }
    } else if (!ns.fileExists("FTPCrack.exe", "home")) {
        if(currentWork?.type !== "CREATE_PROGRAM") {
            ns.singularity.createProgram("FTPCrack.exe", true);
        }
    } else if(currentWork?.type !== "CRIME") {
        ns.singularity.commitCrime("Rob Store", true);
    }
}

/** @param {NS} ns */
function startOrStopScripts(ns, config) {    
    let higherPriorityItemsStarted = true;

    if (config[CONFIG_SPEND_ON_SERVERS] && higherPriorityItemsStarted) {
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "servers/purchaseServers8gb.js");
    } else {
        killScriptIfRunningOnHome(ns, "servers/purchaseServers8gb.js");
    }
    if (config[CONFIG_SPEND_ON_HACKNET] && higherPriorityItemsStarted) {
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "hacknet/purchaseNodes.js", ["--canUseAllMoney"]);
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "hacknet/upgradeNodes.js", ["--canUseAllMoney"]);
    } else {
        killScriptIfRunningOnHome(ns, "hacknet/purchaseNodes.js");
        killScriptIfRunningOnHome(ns, "hacknet/upgradeNodes.js");
    }
    if(higherPriorityItemsStarted) {
        higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "control/makeServersHackN00dles.js");
    }

    return higherPriorityItemsStarted;
}

/** @param {NS} ns */
function purchaseThings(ns) {
    ns.singularity.upgradeHomeRam();
}