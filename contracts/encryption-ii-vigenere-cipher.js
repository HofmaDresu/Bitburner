const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	const contractFileName = arguments[0].args[1];
    const data = ns.codingcontract.getData(contractFileName, targetServer);
    const message = data[0];
    const keyword = data[1];
    const cipherKeyword = keyword.padEnd(message.length, keyword);


    const encodedMessage = message.split('').map((messageCharacter, characterIndex) => {
        const cipherKeywordCharacter = cipherKeyword[characterIndex];
        const shift = alphabet.indexOf(messageCharacter);
        const cipherIndex = alphabet.indexOf(cipherKeywordCharacter);

        if (cipherIndex + shift < alphabet.length) return alphabet[cipherIndex + shift];

        return alphabet[(shift + cipherIndex) - alphabet.length];
    }).join('');

    const result = ns.codingcontract.attempt(encodedMessage, contractFileName, targetServer, {returnReward: true});
    if (result) {
        ns.tprint(result);
    } else {
        ns.alert(`Failed Encryption I Caeser Cipher contract! ${targetServer} ${contractFileName}`);
    }
}