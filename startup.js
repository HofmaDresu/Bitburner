import { storeNodeMultipliers } from "helpers";
import { resetMarketData } from "stocks/helpers";

/** @param {NS} ns */
export async function main(ns) {
	storeNodeMultipliers(ns);
	resetMarketData(ns);
	ns.spawn("/automation/script-starter.js");
}
