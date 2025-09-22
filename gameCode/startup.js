import { getBestServerToHack, getConfig, saveConfig, CONFIG_BUY_STOCKS, getAvailableRam, startScriptOnHomeIfAble} from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    let availableRam = getAvailableRam(ns, "home");
    let stillMoreToStart = true;

    while(stillMoreToStart) {
        availableRam = getAvailableRam(ns, "home");
        let started = false;
        setStartupConfig(ns);

        started = startScriptOnHomeIfAble(ns, "control/makeServersSelfHack.js", availableRam);
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptOnHomeIfAble(ns, "servers/purchaseServers.js", availableRam);
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptOnHomeIfAble(ns, "hacknet/purchaseNodes.js", availableRam);
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptOnHomeIfAble(ns, "hacknet/upgradeNodes.js", availableRam);
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptOnHomeIfAble(ns, "stocks/trackStockValues.js", availableRam);
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptOnHomeIfAble(ns, "stocks/playTheMarket.js", availableRam);
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptOnHomeIfAble(ns, "control/makeMoneyFromTarget.js", availableRam, [getBestServerToHack(ns)]);
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
    saveConfig(ns, config);
}