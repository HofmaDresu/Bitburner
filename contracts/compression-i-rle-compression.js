/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	const contractFileName = arguments[0].args[1];
    const data = ns.codingcontract.getData(contractFileName, targetServer);

    let i = 1;
    let previousLetter = data[0];
    let currentLetter = '';
    let repetitionCount = 1;
    let compressedString = '';
    while (i < data.length) {
        currentLetter = data[i];
        if (currentLetter !== previousLetter || repetitionCount === 9) {
            compressedString += `${repetitionCount}${previousLetter}`
            repetitionCount = 1;
            previousLetter = currentLetter;
        } else {
            repetitionCount++;
        }
        i++;
    }
    compressedString += `${repetitionCount}${previousLetter}`
    const result = ns.codingcontract.attempt(compressedString, contractFileName, targetServer, {returnReward: true});
    if (result) {
        ns.tprint(result);
    } else {
        ns.alert(`Failed compression I RLE contract! ${targetServer} ${contractFileName}`);
    }
}