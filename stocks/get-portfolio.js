import {stockToServers} from "stocks/helpers"

/** @param {NS} ns */
export async function main(ns) {
	Object.keys(stockToServers)
		.map(stockSymbol => {
			const [longShares, longPx, shortShares, shortPx] = ns.stock.getPosition(stockSymbol);
			let value = 0;
			
			value += ns.stock.getSaleGain(stockSymbol, longShares, "Long");
			value += ns.stock.getSaleGain(stockSymbol, shortShares, "Short");
			const cost = longShares * longPx + shortShares * shortPx;

			return {stockSymbol, value, cost, longShares, shortShares};
		})
		.sort((a, b) => b.cost - a.cost)
		.forEach(info => {
			if (info.value !== 0) {
				ns.tprint(`${info.stockSymbol}: cost -> ${info.cost.toLocaleString('en-US')} value -> ${info.value.toLocaleString('en-US')}, position -> ${info.longShares > 0 ? "L" : ""}${info.shortShares > 0 ? "S" : ""}, profit -> ${(info.value - info.cost).toLocaleString('en-US')}, pct -> ${((info.value - info.cost) / info.cost * 100).toLocaleString('en-US')}%`);
			};
		});
}
