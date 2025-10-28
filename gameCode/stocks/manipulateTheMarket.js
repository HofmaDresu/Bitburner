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
                if (sharesLong) {
                    if (ns.getServerSecurityLevel(target) > securityThresh) {
                        await weaken(ns, hostname, [target]);
                    } else  {
                        if (ns.getServerMoneyAvailable(target) < .1 * ns.getServerMaxMoney(target)) {
                            await grow(ns, hostname, [target, true]);
                        } else {
                            await hackTargetToMin(ns, hostname, target);
                        }
                    } 
                } else {
                    if (ns.getServerSecurityLevel(target) > securityThresh) {
                        await weaken(ns, hostname, [target]);
                    } else {        
                        if (ns.getServerMoneyAvailable(target) > .1 * ns.getServerMaxMoney(target)) {
                            await hack(ns, hostname, [target, true]);
                        } else {
                            await growTargetToMax(ns, hostname, target);
                        }
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
    ns.print("hacking " + args[0]);
    await runScriptAtMaxThreads(ns, script, hostname, args);
}

/** @param {NS} ns */
async function grow(ns, hostname, args) {   
    const script = "/growing/growTarget.js";
    ns.print("growing " + args[0]);
    await runScriptAtMaxThreads(ns, script, hostname, args);
}

/** @param {NS} ns */
async function weaken(ns, hostname, args) {   
    const script = "/weakening/weakenTarget.js";
    ns.print("weakening " + args[0]);
    await runScriptAtMaxThreads(ns, script, hostname, args);
}

/** @param {NS} ns */
async function growTargetToMax(ns, hostname, target) {
    const moneyThresh = ns.getServerMaxMoney(target);
    const securityThresh = ns.getServerMinSecurityLevel(target);

    while(ns.getServerMoneyAvailable(target) < moneyThresh) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await weaken(ns, hostname, [target]);
        } else {
            await grow(ns, hostname, [target]);
        }
    } 
}

/** @param {NS} ns */
async function hackTargetToMin(ns, hostname, target) {
    const moneyThresh = ns.getServerMaxMoney(target);
    const securityThresh = ns.getServerMinSecurityLevel(target);

    while(ns.getServerMoneyAvailable(target) < moneyThresh) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await weaken(ns, hostname, [target]);
        } else {
            await hack(ns, hostname, [target]);
        }
    } 
}