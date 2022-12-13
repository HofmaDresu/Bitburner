/** @param {NS} ns */
export async function main(ns) {
	var servers = getStopableServers(ns, "home");

	servers.forEach((s) => {
		ns.killall(s);
	});
}

function getStopableServers(ns, currentServer, previousServer) {
	var servers = ns.scan(currentServer).filter(s => s != previousServer);
	if (!servers || servers.length === 0) return [];
	return servers.flatMap((s) => {
		var hasRootAccess = ns.hasRootAccess(s);

		if (!hasRootAccess) { return };
		return [s, ...getStopableServers(ns, s, currentServer)];
	}).filter(s => s);
}
