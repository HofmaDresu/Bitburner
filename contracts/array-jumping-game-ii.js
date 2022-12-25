
/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	const contractFileName = arguments[0].args[1];
    const data = ns.codingcontract.getData(contractFileName, targetServer);
    const targetIndex = data.length;

    const minMovesToReachEnd = tryToReachEnd(ns, data, 0, targetIndex, 0);

    const result = ns.codingcontract.attempt(minMovesToReachEnd, contractFileName, targetServer, {returnReward: true});
    if (result) {
        ns.tprint(result);
    } else {
        ns.alert(`Failed Array Jumping Game II contract! ${targetServer} ${contractFileName}`);
    }
}

function tryToReachEnd(ns, data, currentIndex, targetIndex, currentDepth) {
    if (currentIndex === targetIndex) return currentDepth;
    if (currentIndex > targetIndex) return 0;

    const possibleMoves = data[currentIndex];
    let minDepth = 0;
    for (let i = 1; i <= possibleMoves; i++) {
        const potentialDepth = tryToReachEnd(ns, data, currentIndex + i, targetIndex, currentDepth + 1);
        if (potentialDepth > 0) {
            minDepth = minDepth === 0 ? potentialDepth : Math.min(minDepth, potentialDepth);
        }
    }

    return minDepth;
}