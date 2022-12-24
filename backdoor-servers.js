/** @param {NS} ns */
export async function main(ns) {
	if (!ns.singularity) {
		ns.tprint("Missing singularity");
		return;
	}

	var servers = ns.scan("home");
	for (let i = 0; i < servers.length; i++) {
		await backdoorServersRecursive(ns, servers[i], "home");
		ns.singularity.connect("home");
	}
	ns.tprint("DONE!");
}

/** @param {NS} ns */
async function backdoorServersRecursive(ns, currentServer, previousServer) {
	ns.print(`${currentServer} <- ${previousServer}`)
	if (!ns.hasRootAccess(currentServer)) return;
	ns.singularity.connect(currentServer);
	await ns.singularity.installBackdoor();
	var servers = ns.scan(currentServer).filter(s => s != previousServer);
	if (!servers || servers.length === 0) return;
	for (let i = 0; i < servers.length; i++) {
		await backdoorServersRecursive(ns, servers[i], currentServer);
		ns.singularity.connect(currentServer);
	}
	ns.singularity.connect(currentServer);
}
