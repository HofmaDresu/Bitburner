import { getBestServerToHack, getConfig, saveConfig, CONFIG_BUY_STOCKS, getAvailableRam } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    let availableRam = getAvailableRam(ns, "home");
    let stillMoreToStart = true;

    while(stillMoreToStart) {
        availableRam = getAvailableRam(ns, "home");
        let started = false;
        setStartupConfig(ns);

        started = startScriptIfAble(ns, "control/makeServersSelfHack.js", availableRam);
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptIfAble(ns, "servers/purchaseServers.js", availableRam);
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptIfAble(ns, "hacknet/purchaseNodes.js", availableRam);
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptIfAble(ns, "hacknet/upgradeNodes.js", availableRam);
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptIfAble(ns, "stocks/trackStockValues.js", availableRam);
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptIfAble(ns, "stocks/playTheMarket.js", availableRam);
        if (!started) {
            await ns.sleep(10000);
            continue;
        }
        started = startScriptIfAble(ns, "control/makeMoneyFromTarget.js", availableRam, [getBestServerToHack(ns)]);
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

/** @param {NS} ns */
function startScriptIfAble(ns, script, availableRam, args = []) {
    const requiredRam = ns.getScriptRam(script);
    if(ns.scriptRunning(script, "home")) {
        return true;
    } else if (requiredRam < availableRam) {
        ns.exec(script, "home", 1, ...args);
        return true;
    }

    return false;
}