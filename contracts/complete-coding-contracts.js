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

/** @param {NS} ns */
async function completeContractsIfPossible(ns, server, files) {
    for (let i = 0; i < files.length; i++) {
        let filename= '';
        const file = files[i];
        switch(ns.codingcontract.getContractType(file, server)) {
            case "Algorithmic Stock Trader I":
                filename = '/contracts/algorithmic-stock-trader-i.js';
                break;
            case "Algorithmic Stock Trader II":
                filename = '/contracts/algorithmic-stock-trader-ii.js';
                break;
            case "Algorithmic Stock Trader III":
                filename = '/contracts/algorithmic-stock-trader-iii.js';
                break;
            case "Algorithmic Stock Trader IV":
                //filename = '/contracts/algorithmic-stock-trader-iv.js';
                break;
            case "Array Jumping Game":
                filename = '/contracts/array-jumping-game.js';
                break;
            case "Array Jumping Game II":
                filename = '/contracts/array-jumping-game-ii.js';
                break;
            case "Compression I: RLE Compression":
                filename = '/contracts/compression-i-rle-compression.js';
                break;
            case "Compression II: LZ Decompression":
                filename = '/contracts/compression-ii-lz-decompression.js';
                break;
            case "Encryption I: Caesar Cipher":
                filename = '/contracts/encryption-i-caesar-cipher.js';
                break;
            case "Encryption II: Vigenère Cipher":
                filename = '/contracts/encryption-ii-vigenere-cipher.js';
                break;
            case "Spiralize Matrix":
                filename = '/contracts/spiralize-matrix.js';
                break;
            case "Subarray with Maximum Sum":
                filename = '/contracts/subarray-with-maximum-sum.js';
                break;
        }
        
        if (filename !== '' && !ns.ps().some(ps => ps.filename === filename && ps.args.some(arg => arg === file))) {
            ns.run(filename, 1, server, file);
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
