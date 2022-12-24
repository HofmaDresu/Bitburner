/** @param {NS} ns */
export async function main(ns) {
	const targetRegex = arguments[0].args[0];
	ns.tprint(findServer(ns, targetRegex, "home"));
}

/** @param {NS} ns */
export function findServer(ns, targetRegex, currentServer, previousServer) {
	const regex = new RegExp(targetRegex, 'i');
	if (regex.test(currentServer)) return [currentServer];
	const servers = ns.scan(currentServer).filter(s => s != previousServer);
	if (!servers || servers.length === 0) return [];
	return servers.flatMap((s) => {
		const potentialMatches = findServer(ns, targetRegex, s, currentServer);
		if (potentialMatches) {
			return [...potentialMatches];
		} else {
			return [];
		}
	}).filter(s => s);
}
