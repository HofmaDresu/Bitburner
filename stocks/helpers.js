export const serverToStock = {
    "alpha-ent": "APHE",
    "avmnite-02h": "",
    catalyst: "",
    CSEC: "",
	foodnstuff: "FNS",
    "harakiri-sushi": "",
    "hong-fang-tea": "",
    "iron-gym": "",
    "I.I.I.I": "",
    joesguns: "JGN",
    "max-hardware": "",
    "n00dles": "",
    "nectar-net": "",
    "neo-net": "",
    netlink: "",
    "omega-net": "OMGA",
    phantasy: "",
    "rothman-uni": "",
    "sigma-cosmetics": "SGC",
    "silver-helix": "",
    "summit-uni": "",
    "the-hub": "",
    zer0: "",
};

export const portfolioFileName = "/stocks/portfolio-database.txt";
export const stockFlagsFileName = "/stocks/stock-flags.txt";
export const stockPriceFileName = "/stocks/stock-database.txt";

export function shouldLowerValueForServer(ns, server) {	
	const stockSymbol = serverToStock[server];
	if (!stockSymbol) return false; // Don't care
	var portfolioData = JSON.parse(ns.read(portfolioFileName));
	var stockData = portfolioData[stockSymbol];
	if (!stockData) return false; // Don't care
	ns.tprint(`Will lower: ${stockData.pos === "S"}`);
	return stockData.pos === "S" || stockData.ammount === 0; // Lower if we have no stock to prep for Long
}

export function shouldRaiseValueForServer(ns, server) {	
	const stockSymbol = serverToStock[server];
	if (!stockSymbol) return false; // Don't care
	var portfolioData = JSON.parse(ns.read(portfolioFileName));
	var stockData = portfolioData[stockSymbol];
	if (!stockData || stockData.ammount === 0) return false; // Don't care
	ns.tprint(`Will raise: ${stockData.pos === "L"}`);
	return stockData.pos === "L";
}
