import { canTradeStocks } from "stocks/helpers";
import { runScriptAtMaxThreads } from "helpers";

const SYMBOL_TO_SERVERS = {
    "ECP": ["ecorp"],
    "MGCP": ["megacorp"],
    "BLD": ["blade"],
    "CLRK": ["clarkinc"],
    "OMTK": ["omnitek"],
    "FSIG": ["4sigma"],
    "KGI": ["kuai-gong"],
    "FLCM": ["fulcrumtech", "fulcrumassets"],
    "STM": ["stormtech"],
    "DCOMM": ["defcomm"],
    "HLS": ["helios"],
    "VITA": ["vitalife"],
    "ICRS": ["icarus"],
    "UNV": ["univ-energy"],
    "AERO": ["aerocorp"],
    "OMN": ["omnia"],
    "SLRS": ["solaris"],
    "GPH": ["global-pharm"],
    "NVMD": ["nova-med"],
    "WDS": [],
    "LXO": ["lexo-corp"],
    "RHOC": ["rho-construction"],
    "APHE": ["alpha-ent"],
    "SYSC": ["syscore"],
    "CTK": ["computek"],
    "NTLK": ["netlink"],
    "OMGA": ["omega-net"],
    "FNS": ["foodnstuff"],
    "JGN": ["joesguns"],
    "SGC": ["sigma-cosmetics"],
    "CTYS": ["catalyst"],
    "MDYN": ["microdyne"],
    "TITN": ["titan-labs"],
};

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('ALL');
    while (!canTradeStocks(ns)) {
        await ns.sleep(1_000);
    }
    const hostname = ns.getHostname();

    const symbols = ns.stock.getSymbols().sort(() => Math.random() > .5 ? -1 : 1);
    while(true) {
        for (const symbol of symbols) {
            for (const target of SYMBOL_TO_SERVERS[symbol]) {
                const securityThresh = ns.getServerMinSecurityLevel(target);
                const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
                if(!ns.hasRootAccess(target)) continue;
                const player = ns.getPlayer();
                const server = ns.getServer(target);
                const actionTime = Math.max(ns.formulas.hacking.growTime(server, player), ns.formulas.hacking.hackTime(server, player), ns.formulas.hacking.weakenTime(server, player)) / 1000;
                if (actionTime > 120) continue;
                if (ns.getServerSecurityLevel(target) > securityThresh) {
                    await weaken(ns, hostname, [target]);
                }
                if (sharesLong) {
                    if (ns.getServerMoneyAvailable(target) < .5 * ns.getServerMaxMoney(target)) {
                        ns.print(`Growing + manipulating ${symbol} because we own ${sharesLong} stocks`)
                        await grow(ns, hostname, [target, true]);
                    } else {
                        ns.print(`Just hacking ${symbol} because we own ${sharesLong} stocks and money available is too high`)
                        await hack(ns, hostname, [target]);
                    }
                } else {    
                    if (ns.getServerMoneyAvailable(target) > .5 * ns.getServerMaxMoney(target)) {
                        ns.print(`Hacking + manipulating ${symbol} because we do not own long stocks`)
                        await hack(ns, hostname, [target, true]);
                    } else {
                        ns.print(`Just growing ${symbol} because we do not own long stocks and money available is too low`)
                        await grow(ns, hostname, [target]);
                    }            
                }
            }
        }
        await ns.stock.nextUpdate();
    }
}



/** @param {NS} ns */
async function hack(ns, hostname, args) {   
    const script = "/hacking/hackTarget.js";
    await runScriptAtMaxThreads(ns, script, hostname, args);
}

/** @param {NS} ns */
async function grow(ns, hostname, args) {   
    const script = "/growing/growTarget.js";
    await runScriptAtMaxThreads(ns, script, hostname, args);
}

/** @param {NS} ns */
async function weaken(ns, hostname, args) {   
    const script = "/weakening/weakenTarget.js";
    await runScriptAtMaxThreads(ns, script, hostname, args);
}