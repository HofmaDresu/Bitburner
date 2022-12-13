import {stockFlagsFileName} from "/stocks/helpers.js"

/** @param {NS} ns */
export async function main(ns) {
	var data = JSON.parse(ns.read(stockFlagsFileName));
	data.allowPurchases = false;	
	ns.write(stockFlagsFileName, JSON.stringify(data), "w");
}
