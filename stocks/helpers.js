export const stockToServers = {
     "WDS": [], 
    "ECP": ["ecorp"], 
    "MGCP": ["megacorp"], 
    "BLD": ["blade"], 
    "CLRK": ["clarkinc"], 
    "OMTK": ["omnitek"], 
    "FSIG": ["4sigma"], 
    "KGI": ["kuai-gong"], 
    "DCOMM": ["defcomm"], 
    "VITA": ["vitalife"], 
    "ICRS": ["icarus"], 
    "UNV": ["univ-energy"], 
    "AERO": ["aerocorp"], 
    "SLRS": ["solaris"], 
    "GPH": ["global-pharm"], 
    "NVMD": ["nova-med"], 
    "LXO": ["lexo-corp"], 
    "RHOC": ["rho-construction"], 
    "APHE": ["alpha-ent"], 
    "SYSC": ["syscore"], 
    "CTK": ["computek"], 
    "NTLK": ["netlink"], 
    "OMGA": ["omega-net"], 
    "JGN": ["joesguns"], 
    "SGC": ["sigma-cosmetics"], 
    "CTYS": ["catalyst"], 
    "MDYN": ["microdyne"], 
    "TITN": ["titan-labs"], 
    "FLCM": ["fulcrumtech", "fulcrumassets"], 
    "STM": ["stormtech"], 
    "HLS": ["helios", "The-Cave"], 
    "OMN": ["omnia"], 
    "FNS": ["foodnstuff"] 
};

export const portfolioFileName = "/stocks/portfolio-database.txt";
export const stockFlagsFileName = "/stocks/stock-flags.txt";
export const stockPriceFileName = "/stocks/stock-database.txt";

/** @param {NS} ns */
export function shouldLowerValueForStock(ns, stockSymbol) {	
	const [longShares, _longPx, _shortShares, _shortPx] = ns.stock.getPosition(stockSymbol)
	return longShares === 0;
}

/** @param {NS} ns */
export function shouldRaiseValueForStock(ns, stockSymbol) {	
	const [longShares, _longPx, shortShares, _shortPx] = ns.stock.getPosition(stockSymbol)
	if (longShares === 0 && shortShares === 0) return false; // Don't care
	return longShares > 0;
}

/** @param {NS} ns */
export async function purchaseWseIfNeeded(ns) {
    while (!ns.stock.hasWSEAccount()) {
        if (ns.getServerMoneyAvailable("home") > 200_000_000) {
            ns.stock.purchaseWseAccount();
        } else {
            await ns.sleep(60000);
        }
        continue;
    }
}

/** @param {NS} ns */
export async function purchaseTIXAPIAccessIfNeeded(ns) {
    while (!ns.stock.hasTIXAPIAccess()) {
        if (ns.getServerMoneyAvailable("home") > 5_000_000_000) {
            ns.stock.purchaseTixApi();
        } else {            
            await ns.sleep(60000);
        }
        continue;
    }
}

/** @param {NS} ns */
export async function purchase4sTIXAPIAccessIfNeeded(ns) {
    while (!ns.stock.has4SDataTIXAPI()) {
        if (ns.getServerMoneyAvailable("home") > 25_000_000_000) {
            ns.stock.purchase4SMarketDataTixApi();
        } else {            
            await ns.sleep(60000);
        }
        continue;
    }
}
