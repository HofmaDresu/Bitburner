import {stockToServers, stockPriceFileName} from "stocks/helpers"

/** @param {NS} ns */
export async function main(ns) {
	var stockPriceData = JSON.parse(ns.read(stockPriceFileName));	
	Object.keys(stockToServers)
		.map(stockSymbol => {
			const [longShares, longPx, shortShares, shortPx] = ns.stock.getPosition(stockSymbol);
			let value = 0;
			
			value += ns.stock.getSaleGain(stockSymbol, longShares, "Long");
			value += ns.stock.getSaleGain(stockSymbol, shortShares, "Short");
			const cost = longShares * longPx + shortShares * shortPx;

			return {stockSymbol, min: stockPriceData[stockSymbol].minPrice, current: ns.stock.getPrice(stockSymbol), max: stockPriceData[stockSymbol].maxPrice};
		})
		.forEach(info => {
			ns.tprint(`${info.stockSymbol}: min -> ${info.min.toLocaleString('en-US')}, current -> ${info.current.toLocaleString('en-US')}, max -> ${info.max.toLocaleString('en-US')}`);
		});
}
