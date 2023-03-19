import {stockToServers} from "stocks/helpers"

/** @param {NS} ns */
export async function main(ns) {
	Object.keys(stockToServers).forEach(stockSymbol => {
		const [longShares, longPx, shortShares, shortPx] = ns.stock.getPosition(stockSymbol);
		let value = 0;
		
		value += ns.stock.getSaleGain(stockSymbol, longShares, "Long");
		value += ns.stock.getSaleGain(stockSymbol, shortShares, "Short");
        const cost = longShares * longPx + shortShares * shortPx;
        if (value !== 0) {
            ns.tprint(`${stockSymbol}: value -> ${value.toLocaleString('en-US')}, profit -> ${(value - cost).toLocaleString('en-US')}`);
        };
	});
}
