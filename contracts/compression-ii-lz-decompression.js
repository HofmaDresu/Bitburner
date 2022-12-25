


/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	const contractFileName = arguments[0].args[1];
    const encodedString = ns.codingcontract.getData(contractFileName, targetServer);
    
    let decodedString = '';
    let chunkType = 1;
    let currentIndex = 0;
    
    while (currentIndex < encodedString.length) {
        if (chunkType === 1) {
            const lettersToCopy = parseInt(encodedString[currentIndex]);
            if (lettersToCopy !== 0) {
                decodedString += encodedString.slice(currentIndex + 1, currentIndex + lettersToCopy + 1);
            }
            currentIndex += 1 + lettersToCopy;
            chunkType = 2;
        } else if (chunkType === 2) {
            const lettersToCopy = parseInt(encodedString[currentIndex]);
            if (lettersToCopy !== 0) {
                const startPosition = decodedString.length - parseInt(encodedString[currentIndex+1]);
                const stringToCopy = decodedString.slice(startPosition, Math.min(startPosition + lettersToCopy, decodedString.length));
                decodedString += stringToCopy.padEnd(lettersToCopy, stringToCopy);
                currentIndex += 2;
            } else {
                currentIndex += 1;
            }

            chunkType = 1;
        }

    }

    const result = ns.codingcontract.attempt(decodedString, contractFileName, targetServer, {returnReward: true});
    if (result) {
        ns.tprint(result);
    } else {
        ns.alert(`Failed Compression II LZ Decompression contract! ${targetServer} ${contractFileName}`);
    }
}