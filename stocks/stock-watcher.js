import {stockPriceFileName, purchaseWseIfNeeded, purchaseTIXAPIAccessIfNeeded} from "/stocks/helpers.js"

/** @param {NS} ns */
export async function main(ns) {
	var data = JSON.parse(ns.read(stockPriceFileName));
	await purchaseWseIfNeeded(ns);
	await purchaseTIXAPIAccessIfNeeded(ns);

	while(true) {
		
		var symbols = ns.stock.getSymbols();

		symbols.forEach(s => {
			var price = ns.stock.getPrice(s.toUpperCase());

			var minPrice = Math.min(data[s]?.minPrice || 999999999999, price);
			var maxPrice = Math.max(data[s]?.maxPrice || 0, price);

			data[s] = {
				minPrice,
				maxPrice
			};
		});


		ns.write(stockPriceFileName, JSON.stringify(data), "w");

        await ns.sleep(3000);
	}
}
