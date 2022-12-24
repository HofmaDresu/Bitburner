/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	ns.tprint(findPathToServer(ns, targetServer, "home"));
}


/** @param {NS} ns */
export function findPathToServer(ns, targetServer, currentServer, previousServer) {
	if (currentServer == targetServer) return [currentServer];
	const servers = ns.scan(currentServer).filter(s => s != previousServer);
	if (!servers || servers.length === 0) return [];
	return servers.flatMap((s) => {
		const potentialPath = findPathToServer(ns, targetServer, s, currentServer);
		if (potentialPath.includes(targetServer)) {
			return [s, ...potentialPath];
		} else {
			return [];
		}
	}).filter(s => s);
}
