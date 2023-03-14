import { storeNodeMultipliers } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
	storeNodeMultipliers(ns);
	ns.spawn("/automation/script-starter.js");
}
