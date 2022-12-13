/** @param {NS} ns */
export async function main(ns) {
	var servers = ns.getPurchasedServers();
	servers.forEach(s => ns.deleteServer(s));
}
