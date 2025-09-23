import { startScriptOnHomeIfAble, killScriptIfRunningOnHome, getAvailableRam, getConfig, CONFIG_BUY_STOCKS, getBestServerToHack } from "helpers";
import { canTradeStocks } from "stocks/helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    let availableRam = getAvailableRam(ns, "home");
    // TODO: restart makeMoneyFromTarget and servers when new best target exists
    // TODO: make actually run the makeServers stuff instead of farming out, they clash with each other
    while (true) {
        if (canTradeStocks(ns) && ns.getPlayer().skills.hacking > 100 && getConfig(ns)[CONFIG_BUY_STOCKS]) {
            killScriptIfRunningOnHome(ns, "control/makeServersSelfHack.js");
            killScriptIfRunningOnHome(ns, "control/makeMoneyFromTarget.js");
            startScriptOnHomeIfAble(ns, "control/makeServersManipulateMarket.js", availableRam)
            startScriptOnHomeIfAble(ns, "stocks/manipulateTheMarket.js", availableRam)
            continue;
        }

        if (!getConfig(ns)[CONFIG_BUY_STOCKS]) {
            killScriptIfRunningOnHome(ns, "control/makeServersManipulateMarket.js");
            killScriptIfRunningOnHome(ns, "stocks/manipulateTheMarket.js");
            startScriptOnHomeIfAble(ns, "control/makeServersSelfHack.js", availableRam);
            startScriptOnHomeIfAble(ns, "control/makeMoneyFromTarget.js", availableRam, [getBestServerToHack(ns)]);

        }

        await ns.sleep(10_000);
    }
}