/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	const contractFileName = arguments[0].args[1];
    const data = ns.codingcontract.getData(contractFileName, targetServer);

    const subArrays = []
    
    for (let i = 0; i < data.length; i++) {
        subArrays.push([data[i]]);
        for (let j = i+1; j < data.length; j++) {
            subArrays.push(data.slice(i, j+1));
        }
    }

    const maxSum = subArrays.map(sa =>sa.reduce((sum, curr) => sum += curr)).sort((a, b) => b - a)[0];

    const result = ns.codingcontract.attempt(maxSum, contractFileName, targetServer, {returnReward: true});
    if (result) {
        ns.tprint(result);
    } else {
        ns.alert(`Failed subarray-with-maximum-sum! ${targetServer} ${contractFileName}`);
    }
}
    