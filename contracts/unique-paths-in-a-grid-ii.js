/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	const contractFileName = arguments[0].args[1];
    const grid = ns.codingcontract.getData(contractFileName, targetServer);
    let currentPosition = {row: 0, column: 0}
    let moves = 0;
    let targetPosition = {row: grid.length-1, column: grid[0].length-1};
    
    moves = getNextMove(ns, grid, currentPosition, targetPosition);

    //ns.tprint(moves);

    const result = ns.codingcontract.attempt(moves, contractFileName, targetServer, {returnReward: true});
    if (result) {
        ns.tprint(result);
    } else {
        ns.alert(`Failed Unique Paths in a Grid II contract! ${targetServer} ${contractFileName}`);
    }
    
}

/** @param {NS} ns */
function getNextMove(ns, grid, currentPosition, targetPosition) {
    //ns.tprint(currentPosition);
    if (currentPosition.row === targetPosition.row && currentPosition.column === targetPosition.column) {
        return 1;
    }

    let paths = 0;

    if (currentPosition.row !== targetPosition.row && grid[currentPosition.row+1][currentPosition.column] == 0) {
        let newPosition = {row: currentPosition.row+1, column: currentPosition.column};
        paths += getNextMove(ns, grid, newPosition, targetPosition);
    }
    if (currentPosition.column !== targetPosition.column && grid[currentPosition.row][currentPosition.column+1] == 0) {
        let newPosition = {row: currentPosition.row, column: currentPosition.column+1};
        paths += getNextMove(ns, grid, newPosition, targetPosition);
    }

    return paths;
}