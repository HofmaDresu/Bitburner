/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	const contractFileName = arguments[0].args[1];
    const gridSize = ns.codingcontract.getData(contractFileName, targetServer);
    let currentPosition = {row: 0, column: 0}
    let moves = 0;
    let targetPosition = {row: gridSize[0]-1, column: gridSize[1]-1};
    
    moves = getNextMove(ns, currentPosition, targetPosition);

    //ns.tprint(moves);

    const result = ns.codingcontract.attempt(moves, contractFileName, targetServer, {returnReward: true});
    if (result) {
        ns.tprint(result);
    } else {
        ns.alert(`Failed Unique Paths in a Grid I contract! ${targetServer} ${contractFileName}`);
    }
}

/** @param {NS} ns */
function getNextMove(ns, currentPosition, targetPosition) {
    //ns.tprint(currentPosition);
    if (currentPosition.row === targetPosition.row && currentPosition.column === targetPosition.column) {
        return 1;
    }

    let paths = 0;

    if (currentPosition.row !== targetPosition.row) {
        let newPosition = {row: currentPosition.row+1, column: currentPosition.column};
        paths += getNextMove(ns, newPosition, targetPosition);
    }
    if (currentPosition.column !== targetPosition.column) {
        let newPosition = {row: currentPosition.row, column: currentPosition.column+1};
        paths += getNextMove(ns, newPosition, targetPosition);
    }

    return paths;
}