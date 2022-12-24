/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	const contractFileName = arguments[0].args[1];

    const type = ns.codingcontract.getContractType(contractFileName, targetServer);
    const description = ns.codingcontract.getDescription(contractFileName, targetServer);
    const numTries = ns.codingcontract.getNumTriesRemaining(contractFileName, targetServer);
    const data = ns.codingcontract.getData(contractFileName, targetServer);
    ns.tprint(type);
    ns.tprint(description);
    ns.tprint(`Tries remaining: ${numTries}`);
    ns.tprint(`Data: ${data}`);
}
    