import {stockPriceFileName, purchaseWseIfNeeded, purchaseTIXAPIAccessIfNeeded} from "/stocks/helpers.js"

/** @param {NS} ns */
export async function main(ns) {
	var data = JSON.parse(ns.read(stockPriceFileName));
	await purchaseWseIfNeeded(ns);
	await purchaseTIXAPIAccessIfNeeded(ns);
    var stockPriceData = JSON.parse(ns.read(stockPriceFileName));
    var bestStock = Object.keys(stockPriceData).map(stockSymbol => {
        var currentDifference = stockPriceData[stockSymbol].maxPrice -  ns.stock.getAskPrice(stockSymbol);
        return {stockSymbol, currentDifference};
    }).filter(stock => stock.currentDifference > 0 && stock.currentDifference <  ns.stock.getAskPrice(stock.stockSymbol) + 100_000).sort((a, b) => b.currentDifference - a.currentDifference)[0];
    ns.tprint(bestStock);
}
