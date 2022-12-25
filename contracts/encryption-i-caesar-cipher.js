const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	const contractFileName = arguments[0].args[1];
    const data = ns.codingcontract.getData(contractFileName, targetServer);
    const message = data[0];
    const shift = data[1];


    const encodedMessage = message.split('').map(char => {
        const cipherIndex = alphabet.indexOf(char);
        if (cipherIndex < 0) return char;

        if (cipherIndex >= shift) return alphabet[cipherIndex - shift];

        return alphabet[alphabet.length - (shift - cipherIndex)];
    }).join('');


    const result = ns.codingcontract.attempt(encodedMessage, contractFileName, targetServer, {returnReward: true});
    if (result) {
        ns.tprint(result);
    } else {
        ns.alert(`Failed Encryption I Caeser Cipher contract! ${targetServer} ${contractFileName}`);
    }
}