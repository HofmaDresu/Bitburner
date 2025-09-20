/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0];

    const hostname = ns.getHostname();
    const args = [target];

    // Infinite loop that continously hacks/grows/weakens the target server
    while(true) {
        await weaken(ns, hostname, args);
        await grow(ns, hostname, args);
        await weaken(ns, hostname, args);
        await hack(ns, hostname, args);
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
    const script = "/growing/growTargetToMax.js";
    ns.print("growing");
    await runScriptAtMaxThreads(ns, script, hostname, args);
}

/** @param {NS} ns */
async function weaken(ns, hostname, args) {   
    const script = "/weakening/weakenTargetToMin.js";
    ns.print("weakening");
    await runScriptAtMaxThreads(ns, script, hostname, args);
}

/** @param {NS} ns */
async function runScriptAtMaxThreads(ns, script, hostname, args) {
    const threads = calculateThreads(ns, script, hostname);
    ns.run(script, threads, ...args);
    await waitForScriptToFinish(ns, script, hostname, args);
}

/** @param {NS} ns */
async function waitForScriptToFinish(ns, script, hostname, args) {
    while(ns.isRunning(script, hostname, ...args)) {
        await ns.asleep(1000);
    }
}

/** @param {NS} ns */
function calculateThreads(ns, script, hostname) {
    const requiredRam = ns.getScriptRam(script);
    const maxServerRam = ns.getServerMaxRam(hostname);
    const usedServerRam = ns.getServerUsedRam(hostname);
    const availableRam = maxServerRam - usedServerRam;
    const availabeThreads = availableRam / requiredRam;
    return Math.floor(availabeThreads);
}