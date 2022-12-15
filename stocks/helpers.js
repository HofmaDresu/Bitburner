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
    "CTK": ["comptek"], 
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

export function shouldLowerValueForStock(ns, stockSymbol) {	
	var portfolioData = JSON.parse(ns.read(portfolioFileName));
	var stockData = portfolioData[stockSymbol];
	if (!stockData) return false; // Don't care
	ns.tprint(`Will lower: ${stockData.pos === "S"}`);
	return stockData.pos === "S" || stockData.ammount === 0; // Lower if we have no stock to prep for Long
}

export function shouldRaiseValueForStock(ns, stockSymbol) {	
	var portfolioData = JSON.parse(ns.read(portfolioFileName));
	var stockData = portfolioData[stockSymbol];
	if (!stockData || stockData.ammount === 0) return false; // Don't care
	ns.tprint(`Will raise: ${stockData.pos === "L"}`);
	return stockData.pos === "L";
}
