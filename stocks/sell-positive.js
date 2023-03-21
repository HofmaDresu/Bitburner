import {stockToServers} from "/stocks/helpers.js"

/** @param {NS} ns */
export async function main(ns) {
	var profitableStocks = Object.keys(stockToServers).filter(stockSymbol => {
		const [longShares, _longPx, shortShares, _shortPx] = ns.stock.getPosition(stockSymbol);
		let value = 0;
		
		value += ns.stock.getSaleGain(stockSymbol, longShares, "Long");
		value += ns.stock.getSaleGain(stockSymbol, shortShares, "Short");
		return value > 0;
	});
	profitableStocks.forEach(stockSymbol => {
		const [longShares, _longPx, shortShares, _shortPx] = ns.stock.getPosition(stockSymbol);
        if (longShares) {
            ns.tprint(ns.stock.sellStock(stockSymbol, longShares));
        }
        if (shortShares) {
            ns.tprint(ns.stock.sellShort(stockSymbol, shortShares));
        }
    });
}
