/** @param {NS} ns */
export async function main(ns) {
    const allServers = findAllServers(ns, "home");
    const homeFiles = ns.ls("home");

    allServers.forEach(server => {
        const files = ns.ls(server, ".lit").filter(file => !homeFiles.includes(file));
        ns.scp(files, "home", server);
    });
}


/** @param {NS} ns */
export function findAllServers(ns, currentServer, previousServer) {
	if (!currentServer) return [];
	const servers = ns.scan(currentServer).filter(s => s != previousServer);
	if (!servers || servers.length === 0) return [];
	return servers.flatMap((s) => {
		const potentialPath = findAllServers(ns, s, currentServer);
		return [s, ...potentialPath];
	}).filter(s => s);
}
