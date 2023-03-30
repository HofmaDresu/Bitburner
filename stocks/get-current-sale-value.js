import {stockToServers} from "/stocks/helpers.js"

/** @param {NS} ns */
export async function main(ns) {
	const purchasePrice = Object.keys(stockToServers).map(stockSymbol => {
		const [longShares, longPx, shortShares, shortPx] = ns.stock.getPosition(stockSymbol);
		return longPx * longShares + shortPx * shortShares;
	}).reduce((prev, curr) => prev += curr, 0);
	const currentSaleGain = Object.keys(stockToServers).map(stockSymbol => {
		const [longShares, _longPx, shortShares, _shortPx] = ns.stock.getPosition(stockSymbol);
		let value = 0;
		
		value += ns.stock.getSaleGain(stockSymbol, longShares, "Long");
		value += ns.stock.getSaleGain(stockSymbol, shortShares, "Short");
		return value;
	}).reduce((prev, curr) => prev += curr, 0);
	const currentPositiveSaleGain = Object.keys(stockToServers).map(stockSymbol => {
		const [longShares, _longPx, shortShares, _shortPx] = ns.stock.getPosition(stockSymbol);
		let value = 0;
		
		value += ns.stock.getSaleGain(stockSymbol, longShares, "Long");
		value += ns.stock.getSaleGain(stockSymbol, shortShares, "Short");
		return value;
	}).filter(x => x > 0).reduce((prev, curr) => prev += curr, 0);
	ns.tprint(`Purchased: ${purchasePrice.toLocaleString('en-US')}`);
	ns.tprint(`Total: ${currentSaleGain.toLocaleString('en-US')}`);
	ns.tprint(`Positive: ${currentPositiveSaleGain.toLocaleString('en-US')}`);
}
