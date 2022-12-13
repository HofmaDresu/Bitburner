/** @param {NS} ns */
export async function main(ns) {
	var dbFileName = "/stocks/stock-database.txt";
	var data = JSON.parse(ns.read(dbFileName))

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


		ns.write(dbFileName, JSON.stringify(data), "w");

        await ns.sleep(3000);
	}
}
