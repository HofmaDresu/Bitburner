import { startScriptOnHomeIfAble, killScriptIfRunningOnHome, getConfig, saveConfig, CONFIG_SPEND_ON_HACKNET, CONFIG_SPEND_ON_SERVERS, CONFIG_SHARE_ALL_MEMORY, CONFIG_PURCHASE_ITEMS, getBestServerToHack, moneyHeldIncludingStocks, availableSpendingMoney } from "helpers";
import { canTradeStocks, iOwnStocks } from "stocks/helpers";
import { crackServers } from "control/helpers";
import advanceThroughHacking, {hasAugment} from "control/advanceThroughHacking";
import { sellAll } from "stocks/sellAll";

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
    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("singularity.purchaseProgram");
    ns.disableLog("singularity.upgradeHomeRam");
    ns.disableLog("singularity.upgradeHomeCores");
    ns.disableLog("singularity.purchaseTor");
    ns.disableLog("stock.purchaseWseAccount");
    ns.disableLog("stock.purchaseTixApi");
    ns.disableLog("stock.purchase4SMarketData");
    ns.disableLog("stock.purchase4SMarketDataTixApi");
    ns.ui.openTail();


    while (true) {
        const config = getConfig(ns);

        const setupComplete = await earlyGameSetUp(ns);
        //TODO: break out into its own script for async work
        await crackServers(ns);
        if(config[CONFIG_PURCHASE_ITEMS]) purchaseThings(ns);
        joinNonCityFactions(ns);
        if (setupComplete) advanceThroughHacking(ns);

        const allRunnablesStared = startOrStopScripts(ns, config);

        if (allRunnablesStared && !config[CONFIG_SHARE_ALL_MEMORY]) {
            if (ns.getResetInfo().currentNode !== 8) {
                startScriptOnHomeIfAble(ns, "control/makeMoneyFromTarget.js", [getBestServerToHack(ns)]);
            } else {
                
                startScriptOnHomeIfAble(ns, "stocks/manipulateTheMarket.js");
            }
        }


        await ns.sleep(1_000);
    }
}

/** @param {NS} ns */
async function earlyGameSetUp(ns) {
    const player = ns.getPlayer();
    const hackSkill = player.skills.hacking;
    const currentWork = ns.singularity.getCurrentWork();
    //TODO: only focus if we don't have Neuroreceptor Management Implant

    if (hackSkill <= 10) {
        if(currentWork?.type !== "CLASS") {
            ns.singularity.universityCourse("rothman university", "Stucy Computer Science", true);
        }
        return false;
    } else if (hackSkill <= 50) {
        if(currentWork?.type !== "CRIME") {
            ns.singularity.commitCrime("Rob Store", true);
        }
        return false;
    } else if (!ns.fileExists("BruteSSH.exe", "home")) {
        if(currentWork?.type !== "CREATE_PROGRAM") {
            ns.singularity.createProgram("BruteSSH.exe", true);
        }
        return false;
    } else if (hackSkill <= 100) {
        if(currentWork?.type !== "CRIME") {
            ns.singularity.commitCrime("Rob Store", true);
        }
        return false;
    } else if (!ns.fileExists("FTPCrack.exe", "home")) {
        if(currentWork?.type !== "CREATE_PROGRAM") {
            ns.singularity.createProgram("FTPCrack.exe", true);
        }
        return false;
    } else if(!currentWork) {
        if(hasAugment(ns, "The Red Pill")) {
            ns.singularity.commitCrime("Homicide", true);

        } else {
            ns.singularity.commitCrime("Rob Store", true);
        }
        return true;
    }    
    
    return true;
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
    
    if (ns.getResetInfo().currentNode !== 8 || availableSpendingMoney(ns) > 1_000_000_000) {
        ns.singularity.purchaseTor();
        ns.singularity.purchaseProgram("BruteSSH.exe");
        ns.singularity.purchaseProgram("FTPCrack.exe");
        ns.singularity.purchaseProgram("relaySMTP.exe");
        ns.singularity.purchaseProgram("HTTPWorm.exe");
        ns.singularity.purchaseProgram("SQLInject.exe");
        ns.singularity.purchaseProgram("DeepscanV2.exe");
        ns.singularity.purchaseProgram("AutoLink.exe");
        ns.singularity.purchaseProgram("Formulas.exe");
    }
    if (ns.getResetInfo().currentNode !== 8) {
        ns.singularity.upgradeHomeRam();
        ns.singularity.upgradeHomeCores();
    }
    ns.stock.purchaseWseAccount();
    ns.stock.purchaseTixApi();
    // ns.stock.purchase4SMarketData();
    if (ns.getResetInfo().currentNode === 8 && !ns.stock.has4SDataTIXAPI() && moneyHeldIncludingStocks(ns) * .8 > 30_000_000_000) {
        sellAll(ns);
    }
    ns.stock.purchase4SMarketDataTixApi();
}

/** @param {NS} ns */
function startOrStopScripts(ns, config) {    
    let higherPriorityItemsStarted = true;
    const moneySources = ns.getMoneySources().sinceInstall;
    const shouldManipulateMarket = canTradeStocks(ns) && (iOwnStocks(ns) || ns.getResetInfo().currentNode === 8);

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