import { runScriptAtMaxThreads } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("asleep");
    ns.disableLog("sleep");
    const target = ns.args[0];

    const hostname = ns.getHostname();
    const args = [target];
    const securityThresh = ns.getServerMinSecurityLevel(target);
    const moneyThresh = ns.getServerMaxMoney(target);

    // Infinite loop that continously hacks/grows/weakens the target server
    while(true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await weaken(ns, hostname, args);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            await grow(ns, hostname, args);
        } else {        
            await hack(ns, hostname, args);
        }
    }
}

/** @param {NS} ns */
async function hack(ns, hostname, args) {   
    const script = "/hacking/hackTarget.js";
    ns.print("hacking");
    await runScriptAtMaxThreads(ns, script, hostname, args);
}

/** @param {NS} ns */
async function grow(ns, hostname, args) {   
    const script = "/growing/growTarget.js";
    ns.print("growing");
    await runScriptAtMaxThreads(ns, script, hostname, args);
}

/** @param {NS} ns */
async function weaken(ns, hostname, args) {   
    const script = "/weakening/weakenTarget.js";
    ns.print("weakening");
    await runScriptAtMaxThreads(ns, script, hostname, args);
}