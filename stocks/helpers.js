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

export function getStockForServer(server) {
    return Object.keys(stockToServers).find(symbol => stockToServers[symbol].some(svr => svr === server));
}

export const stockFlagsFileName = "/stocks/stock-flags.txt";
export const stockPriceFileName = "/stocks/stock-database.txt";

export function resetMarketData(ns) {    
    ns.write(stockPriceFileName, JSON.stringify({}), "w");
}

/** @param {NS} ns */
export function shouldLowerValueForStock(ns, stockSymbol) {	
    if (!ns.stock.hasWSEAccount() || !ns.stock.hasTIXAPIAccess()) return true;
    if (!stockSymbol) return false;
	const [longShares, _longPx, _shortShares, _shortPx] = ns.stock.getPosition(stockSymbol);
	return longShares === 0;
}

/** @param {NS} ns */
export function shouldRaiseValueForStock(ns, stockSymbol) {	
    if (!ns.stock.hasWSEAccount() || !ns.stock.hasTIXAPIAccess()) return false;
    if (!stockSymbol) return false;
	const [longShares, _longPx, shortShares, _shortPx] = ns.stock.getPosition(stockSymbol);
	if (longShares === 0 && shortShares === 0) return false; // Don't care
	return longShares > 0;
}

/** @param {NS} ns */
export async function purchaseWseIfNeeded(ns) {
    while (!ns.stock.hasWSEAccount()) {
        ns.stock.purchaseWseAccount();
        await ns.sleep(60000);
        continue;
    }
}

/** @param {NS} ns */
export async function purchaseTIXAPIAccessIfNeeded(ns) {
    while (!ns.stock.hasTIXAPIAccess()) {
        ns.stock.purchaseTixApi();
        await ns.sleep(60000);
        continue;
    }
}

/** @param {NS} ns */
export function purchase4sTIXAPIAccessIfNeeded(ns) {
    if (!ns.stock.has4SDataTIXAPI()) {
        ns.stock.purchase4SMarketDataTixApi();
    }
}
