import {stockToServers} from "/stocks/helpers.js"

/** @param {NS} ns */
export async function main(ns) {
	var currentSaleGain = Object.keys(stockToServers).map(stockSymbol => {
		const [longShares, _longPx, shortShares, _shortPx] = ns.stock.getPosition(stockSymbol);
		let value = 0;
		
		value += ns.stock.getSaleGain(stockSymbol, longShares, "Long");
		value += ns.stock.getSaleGain(stockSymbol, shortShares, "Short");
		return value;
	}).reduce((prev, curr) => prev += curr, 0);
	ns.tprint(currentSaleGain.toLocaleString('en-US'));
}
