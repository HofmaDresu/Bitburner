import { startScriptOnHomeIfAble, killScriptIfRunningOnHome, getConfig, CONFIG_SPEND_ON_HACKNET, CONFIG_SPEND_ON_SERVERS } from "helpers";
import { canTradeStocks } from "stocks/helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    // TODO: improve with singularity
    // buy TOR / files when able
    // start at uni until hack >= 10?
    // next create BruteSSH
    // next rob store
    let higherPriorityItemsStarted = true;
    while (true) {
        const config = getConfig(ns);

        // TODO: restart makeMoneyFromTarget and servers when new best target exists
        // TODO: move "make" commands into here instead of separate files

        // TODO: stop spending on hacknet at some point?
        if ([config[CONFIG_SPEND_ON_HACKNET]] && higherPriorityItemsStarted) {
            higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "hacknet/purchaseNodes.js");
            higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "hacknet/makeServersSelfHack.js");
        } else {
            killScriptIfRunningOnHome(ns, "hacknet/purchaseNodes.js")
            killScriptIfRunningOnHome(ns, "hacknet/upgradeNodes.js")
        }

        if ([config[CONFIG_SPEND_ON_SERVERS]] && higherPriorityItemsStarted) {
            higherPriorityItemsStarted = startScriptOnHomeIfAble(ns, "servers/purchaseServers.js");
        } else {
            killScriptIfRunningOnHome(ns, "servers/purchaseServers.js")
        }

        await ns.sleep(10_000);
    }
}