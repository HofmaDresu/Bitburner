/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("scan");

    while(true) {
        const allServers = findAllServers(ns, "home");
        const homeFiles = ns.ls("home");
        
        for (let i = 0; i < allServers.length; i++) {
            const server = allServers[i];
            const files = ns.ls(server, ".cct").filter(file => !homeFiles.includes(file));
            if (files.length) {
                await completeContractsIfPossible(ns, server, files);
            }
            await ns.sleep(50);
        }
        await ns.sleep(10 * 60 * 1000);
    }
}

async function completeContractsIfPossible(ns, server, files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        switch(await ns.codingcontract.getContractType(file, server)) {
            case "Algorithmic Stock Trader I":
                ns.run('/contracts/algorithmic-stock-trader-i.js', 1, server, file);
                break;
            case "Algorithmic Stock Trader II":
                ns.run('/contracts/algorithmic-stock-trader-ii.js', 1, server, file);
                break;
            case "Algorithmic Stock Trader III":
                ns.run('/contracts/algorithmic-stock-trader-iii.js', 1, server, file);
                break;
            case "Algorithmic Stock Trader IV":
                ns.run('/contracts/algorithmic-stock-trader-iv.js', 1, server, file);
                break;
            case "Array Jumping Game":
                ns.run('/contracts/array-jumping-game.js', 1, server, file);
                break;
            case "Array Jumping Game II":
                ns.run('/contracts/array-jumping-game-ii.js', 1, server, file);
                break;
            case "Compression I: RLE Compression":
                ns.run('/contracts/compression-i-rle-compression.js', 1, server, file);
                break;
            case "Compression II: LZ Decompression":
                ns.run('/contracts/compression-ii-lz-decompression.js', 1, server, file);
                break;
            case "Encryption I: Caesar Cipher":
                ns.run('/contracts/encryption-i-caesar-cipher.js', 1, server, file);
                break;
            case "Encryption II: Vigenère Cipher":
                ns.run('/contracts/encryption-ii-vigenere-cipher.js', 1, server, file);
                break;
            case "Spiralize Matrix":
                ns.run('/contracts/spiralize-matrix.js', 1, server, file);
                break;
            case "Subarray with Maximum Sum":
                ns.run('/contracts/subarray-with-maximum-sum.js', 1, server, file);
                break;
        }
        await ns.sleep(50);
    };
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
