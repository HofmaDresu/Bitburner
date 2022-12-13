import {portfolioFileName} from "/stocks/helpers.js"

/** @param {NS} ns */
export async function main(ns) {
	var portfolioData = JSON.parse(ns.read(portfolioFileName));
	var currentSaleGain = Object.keys(portfolioData).map(stockSymbol => {
		var ownedData = portfolioData[stockSymbol];
		if (!ownedData?.amount) return;
		return ns.stock.getSaleGain(stockSymbol, ownedData.amount, ownedData.pos === "L" ? "Long" : "Short");
	}).filter(x => x).reduce((prev, curr) => prev += curr, 0);
	ns.tprint(currentSaleGain.toLocaleString('en-US'));
}
