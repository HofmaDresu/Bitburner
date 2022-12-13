/** @param {NS} ns */
export async function main(ns) {
	var dbFileName = "/stocks/stock-flags.txt";
	var data = JSON.parse(ns.read(dbFileName));
	data.allowPurchases = true;	
	ns.write(dbFileName, JSON.stringify(data), "w");
}
