/** @param {NS} ns */
export async function main(ns) {
	ns.tprint(findPathToServer(ns, "home"));
}


/** @param {NS} ns */
export function findPathToServer(ns, currentServer, previousServer) {
	if (!currentServer) return [];
	const servers = ns.scan(currentServer).filter(s => s != previousServer);
	if (!servers || servers.length === 0) return [];
	return servers.flatMap((s) => {
		const potentialPath = findPathToServer(ns, s, currentServer);
		return [s, ...potentialPath];
	}).filter(s => s);
}
