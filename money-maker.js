const portfolioFileName = "/stocks/portfolio-database.txt";

const serverToStock = {
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
}

/** @param {NS} ns */
export async function main(ns) {
	const server = arguments[0].args[0];
	while(true) {
		await makeMoneyFromServer(ns, server);
	}
}

async function makeMoneyFromServer(ns, server) {
	await prepServerForHack(ns, server);
	await ns.hack(server, shouldLowerValue(ns, server));
}

async function prepServerForHack(ns, server) {
	const maxServerMoney = await ns.getServerMaxMoney(server);
	let currentServerMoney = await ns.getServerMoneyAvailable(server);
	while (currentServerMoney < maxServerMoney * .75) {
		await ns.grow(server, shouldRaiseValue(ns, server));
		await weaken(ns, server);
		currentServerMoney = await ns.getServerMoneyAvailable(server);
	}	
}

async function weaken(ns, server) {
	const minSecurityLevel = ns.getServerMinSecurityLevel(server);
	while (await ns.getServerSecurityLevel(server) > minSecurityLevel + 1) {
		await ns.weaken(server);
	}
}

function shouldLowerValue(ns, server) {	
	const stockSymbol = serverToStock[server];
	if (!stockSymbol) return false; // Don't care
	var portfolioData = JSON.parse(ns.read(portfolioFileName));
	var stockData = portfolioData[stockSymbol];
	if (!stockData || stockData.ammount === 0) return false; // Don't care
	ns.tprint(`Will lower: ${stockData.pos === "S"}`);
	return stockData.pos === "S";
}

function shouldRaiseValue(ns, server) {	
	const stockSymbol = serverToStock[server];
	if (!stockSymbol) return false; // Don't care
	var portfolioData = JSON.parse(ns.read(portfolioFileName));
	var stockData = portfolioData[stockSymbol];
	if (!stockData || stockData.ammount === 0) return false; // Don't care
	ns.tprint(`Will raise: ${stockData.pos === "L"}`);
	return stockData.pos === "L";
}
