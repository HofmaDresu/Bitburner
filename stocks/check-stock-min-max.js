import {stockPriceFileName} from "stocks/helpers"

/** @param {NS} ns */
export async function main(ns) {
	const data = JSON.parse(ns.read(stockPriceFileName));
    const stockSymbol = arguments[0].args[0];

	ns.tprint(`${stockSymbol}: ${data[stockSymbol].minPrice.toLocaleString('en-US')} - ${data[stockSymbol].maxPrice.toLocaleString('en-US')}`)
}
