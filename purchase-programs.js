/** @param {NS} ns */
export async function main(ns) {
	// Requires Singularity API
	//while (!ns.fileExists('sqlinject.exe')) {
		const servers = ns.scan("home");
		if (servers.includes("darkweb")) {
			ns.tprint("woohoo!");
			ns.exec("buy", "darkweb", 1, "BruteSSH.exe")
		} else {
			// TODO: eventually purchase TOR
		}
	//	await ns.sleep(60000);
	//}
}
