import { startScriptOnHomeIfAble, killScriptIfRunningOnHome, getAvailableRam } from "helpers";
import { canTradeStocks } from "stocks/helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    let availableRam = getAvailableRam(ns, "home");   
    let thingsToDo = true;
    // TODO: restart makeMoneyFromTarget and servers when new best target exists
    while (thingsToDo) {
        if (canTradeStocks(ns) && ns.getPlayer().skills.hacking > 100) {
            killScriptIfRunningOnHome(ns, "control/makeServersSelfHack.js");
            killScriptIfRunningOnHome(ns, "control/makeMoneyFromTarget.js");
            startScriptOnHomeIfAble(ns, "control/makeServersManipulateMarket.js", availableRam)
            startScriptOnHomeIfAble(ns, "stocks/manipulateTheMarket.js", availableRam)
            thingsToDo = false;
        }

        await ns.sleep(10_000);
    }
}