import { getBestServerToHack } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("asleep");
    const maxServerRam = ns.getServerMaxRam("home");
    let usedServerRam = ns.getServerUsedRam("home");
    let availableRam = maxServerRam - usedServerRam;
    startScriptIfAble(ns, "servers/purchaseServers.js", availableRam);
    let stillMoreToStart = true;

    while(stillMoreToStart) {
        usedServerRam = ns.getServerUsedRam("home");
        availableRam = maxServerRam - usedServerRam;

        let started = startScriptIfAble(ns, "control/makeServersSelfHack.js", availableRam);
        if (!started) {
            await ns.asleep(10000);
            continue;
        }
        started = startScriptIfAble(ns, "control/makeMoneyFromTarget.js", availableRam, [getBestServerToHack(ns)]);
        if (!started) {
            await ns.asleep(10000);
            continue;
        }

        await ns.asleep(1000);
        stillMoreToStart = false;
    }
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