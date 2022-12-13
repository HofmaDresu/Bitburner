import {getStopableServers} from "/helpers.js";

/** @param {NS} ns */
export async function main(ns) {
	var servers = getStopableServers(ns, "home");

	servers.forEach((s) => {
		ns.killall(s);
	});
}
