/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("scan");
    const allServers = findAllServers(ns, "home");
    const homeFiles = ns.ls("home");

    while(true) {
        allServers.forEach(server => {
            const files = ns.ls(server, ".cct").filter(file => !homeFiles.includes(file));
            if (files.length) {
                completeContractsIfPossible(ns, server, files);
            }
        });
        await ns.sleep(60 * 60 * 1000);
    }
}

function completeContractsIfPossible(ns, server, files) {
    files.forEach(file => {
        switch(ns.codingcontract.getContractType(file, server)) {
            case "Algorithmic Stock Trader II":
                ns.run('/contracts/algorithmic-stock-trader-ii.js', 1, server, file);
                break;
            case "Algorithmic Stock Trader III":
                ns.run('/contracts/algorithmic-stock-trader-iii.js', 1, server, file);
                break;
            case "Algorithmic Stock Trader IV":
                ns.run('/contracts/algorithmic-stock-trader-iv.js', 1, server, file);
                break;
            case "Subarray with Maximum Sum":
                ns.run('/contracts/subarray-with-maximum-sum.js', 1, server, file);
                break;
        }

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
