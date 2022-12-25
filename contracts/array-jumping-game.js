
/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	const contractFileName = arguments[0].args[1];
    const data = ns.codingcontract.getData(contractFileName, targetServer);
    const targetIndex = data.length;

    const canReachEnd = tryToReachEnd(ns, data, 0, targetIndex);

    const result = ns.codingcontract.attempt(canReachEnd ? 1 : 0, contractFileName, targetServer, {returnReward: true});
    if (result) {
        ns.tprint(result);
    } else {
        ns.alert(`Failed Array Jumping Game contract! ${targetServer} ${contractFileName}`);
    }
}

function tryToReachEnd(ns, data, currentIndex, targetIndex) {
    if (currentIndex === targetIndex) return true;
    if (currentIndex > targetIndex) return false;

    const possibleMoves = data[currentIndex];
    let canReachEnd = false;
    for (let i = 1; i <= possibleMoves; i++) {
        canReachEnd ||= tryToReachEnd(ns, data, currentIndex + i, targetIndex);
    }

    return canReachEnd;
}