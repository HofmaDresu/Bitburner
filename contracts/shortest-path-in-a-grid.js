/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	const contractFileName = arguments[0].args[1];
    const grid = ns.codingcontract.getData(contractFileName, targetServer);
    let currentPosition = {row: 0, column: 0}
    let moves = "";
    let targetPosition = {row: grid.length-1, column: grid[0].length-1};
    
    moves = getNextMove(ns, grid, currentPosition, targetPosition, moves) || "";
    /*
    grid.forEach(element => {
        ns.tprint(element);
        
    });
    ns.tprint(moves);
    */

    const result = ns.codingcontract.attempt(moves, contractFileName, targetServer, {returnReward: true});
    if (result) {
        ns.tprint(result);
    } else {
        ns.alert(`Failed Shortest Path in a Grid contract! ${targetServer} ${contractFileName}`);
    }
}

/** @param {NS} ns */
function getNextMove(ns, grid, currentPosition, targetPosition, moves) {
    //ns.tprint(moves);
    if (currentPosition.row === targetPosition.row && currentPosition.column === targetPosition.column) {
        return moves || "";
    }

    let potentialPaths = [];
    const prevMove = moves.at(-1);

    if (prevMove !== "U" && currentPosition.row !== targetPosition.row && grid[currentPosition.row+1][currentPosition.column] == 0) {
        let newPosition = {row: currentPosition.row+1, column: currentPosition.column};
        potentialPaths.push(getNextMove(ns, grid, newPosition, targetPosition, moves + "D"));
    }
    if (prevMove !== "D" && currentPosition.row !== 0 && grid[currentPosition.row-1][currentPosition.column] == 0) {
        let newPosition = {row: currentPosition.row-1, column: currentPosition.column};
        potentialPaths.push(getNextMove(ns, grid, newPosition, targetPosition, moves + "U"));
    }
    if (currentPosition.column !== targetPosition.column && grid[currentPosition.row][currentPosition.column+1] == 0) {
        let newPosition = {row: currentPosition.row, column: currentPosition.column+1};
        potentialPaths.push(getNextMove(ns, grid, newPosition, targetPosition, moves + "R"));
    }

    return potentialPaths.sort((a, b) => a.length - b.length)[0];
}