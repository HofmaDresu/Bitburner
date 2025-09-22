import { startScriptOnHomeIfAble, killScriptIfRunningOnHome } from "helpers";
import { canTradeStocks } from "stocks/helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    let availableRam = getAvailableRam(ns, "home");   
    let thingsToDo = true;
    while (thingsToDo) {
        if (canTradeStocks(ns) && iOwnStocks(ns)) {
            killScriptIfRunningOnHome(ns, "control/makeServersSelfHack.js");
            killScriptIfRunningOnHome(ns, "control/makeMoneyFromTarget.js");
            startScriptOnHomeIfAble(ns, "control/makeServersManipulateMarket.js", availableRam)
            startScriptOnHomeIfAble(ns, "stocks/manipulateTheMarket.js", availableRam)
            thingsToDo = false;
        }

        await ns.sleep(10_000);
    }
}

/** @param {NS} ns */
function iOwnStocks(ns) {
    const symbols = ns.stock.getSymbols();
    for (const symbol of symbols) {
        const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
        if (sharesLong || sharesShort) {
            return true;
        }
    }
    return false;
}