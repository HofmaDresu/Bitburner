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
        ns.print("LOOP")
        let started = false;
        setStartupConfig(ns);

        started = startScriptOnHomeIfAble(ns, "control/makeServersSelfHack.js");
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptOnHomeIfAble(ns, "hacknet/purchaseNodes.js");
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptOnHomeIfAble(ns, "hacknet/upgradeNodes.js");
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptOnHomeIfAble(ns, "servers/purchaseServers.js");
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptOnHomeIfAble(ns, "stocks/trackStockValues.js");
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptOnHomeIfAble(ns, "stocks/playTheMarket.js");
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        // started = startScriptOnHomeIfAble(ns, "control/homeRunner.js");
        // if (!started) {
        //     await ns.sleep(10000);
        //     continue;
        // }
        started = startScriptOnHomeIfAble(ns, "control/makeMoneyFromTarget.js", [getBestServerToHack(ns)]);
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
    config[CONFIG_BUY_STOCKS] = true;
    config[CONFIG_SPEND_ON_HACKNET] = true;
    config[CONFIG_SPEND_ON_SERVERS] = true;
    saveConfig(ns, config);
}