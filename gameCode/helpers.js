/** @param {NS} ns */
export function getBestServerToHack(ns) {
    const serversToHack = getServers(ns);
    const myHackingAbility = ns.getPlayer().skills.hacking;
    const serversWithRootAccess = serversToHack.filter(ns.hasRootAccess);
    const serversSortedByMoney = serversWithRootAccess.sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a));
    const serversInGoodHackRange = serversSortedByMoney.filter((s) => ns.getServerRequiredHackingLevel(s) < .5 * myHackingAbility);
    const serversInAnyHackRange = serversSortedByMoney.filter((s) => ns.getServerRequiredHackingLevel(s) < myHackingAbility);

    return serversInGoodHackRange[0] || serversInAnyHackRange[0] || "n00dles";
}

/** @param {NS} ns */
export function getServers(ns) {
    let servers = ns.scan("home").filter((s) => s.indexOf("pserv") === -1);
    let currentServersLength = 0;
    let iterator = 0;
    do {
        const newServers = ns.scan(servers[iterator]).filter((s) => servers.indexOf(s) === -1 && s !== "home");
        servers = servers.concat(newServers);
        currentServersLength = servers.length;
        iterator++;
    } while (iterator < currentServersLength);

    return servers;    
}

/** @param {NS} ns */
export function copyAndRunHackingScripts(ns, hostname, target) {
    copyAllScripts(ns, hostname);
    ns.exec("control/makeMoneyFromTarget.js", hostname, 1, target);
}

/** @param {NS} ns */
export function copyAndRunMarketManipulationScripts(ns, hostname) {
    copyAllScripts(ns, hostname);
    ns.exec("stocks/manipulateTheMarket.js", hostname, 1);
}

function copyAllScripts(ns, hostname) {
    ns.scp(["control/makeMoneyFromTarget.js", "growing/growTarget.js", "growing/growTargetToMax.js", "hacking/hackTarget.js", "weakening/weakenTargetToMin.js", "weakening/weakenTarget.js", "stocks/manipulateTheMarket.js", "helpers.js", "stocks/helpers.js"], hostname);
}

/** @param {NS} ns */
export function availableSpendingMoney(ns, reserveAmount = .1) {
    return ns.getServerMoneyAvailable("home") * (1 - reserveAmount);
}


export const CONFIG_FILE_NAME = "database/config.js";
export const CONFIG_BUY_STOCKS = "buyStocks";

/** @param {NS} ns */
export function getConfig(ns) {    
    let configData = {};
    try {
        configData = JSON.parse(ns.read(CONFIG_FILE_NAME));
    } catch {}
    return configData;
}

/** @param {NS} ns */
export function saveConfig(ns, config) {
    ns.write(CONFIG_FILE_NAME, JSON.stringify(config), "w");
}

/** @param {NS} ns */
export async function runScriptAtMaxThreads(ns, script, hostname, args) {
    const threads = calculateThreads(ns, script, hostname);
    if (threads === 0) {
        await ns.sleep(10000);
        return;
    };
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