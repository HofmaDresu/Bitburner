
const OPPONENTS = ["Netburners", "Slum Snakes", "The Black Hand", "Tetrads", "Daedalus", "Illuminati"];

/** @param {NS} ns */
export async function main(ns) {
    while (true) {
        for (const opponent of OPPONENTS) {
            ns.go.resetBoardState(opponent, 5);
            await ns.sleep(1000);
            await playGame(ns);
        }
    }
}

/** @param {NS} ns */
async function playGame(ns) {
    let result, x, y;

    do {
        const board = ns.go.getBoardState();
        const validMoves = ns.go.analysis.getValidMoves();

        // TODO: more move options
        let move = getCapturingMove(ns, board, validMoves);
        if(!move) {
            move = getRandomMove(board, validMoves);
        }

        // Choose a move from our options (currently just "random move")
        x = move[0];
        y = move[1];

        if (x === undefined) {
            // Pass turn if no moves are found
            result = await ns.go.passTurn();
        } else {
            // Play the selected move
            result = await ns.go.makeMove(x, y);
        }

        // Log opponent's next move, once it happens
        await ns.go.opponentNextTurn();

        // Keep looping as long as the opponent is playing moves
    } while (result?.type !== "gameOver");
}

/**
 * Choose one of the empty points on the board at random to play
 */
const getRandomMove = (board, validMoves) => {
    const moveOptions = [];
    const size = board[0].length;

    // Look through all the points on the board
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            // Make sure the point is a valid move
            const isValidMove = validMoves[x][y] === true;
            // Leave some spaces to make it harder to capture our pieces.
            // We don't want to run out of empty node connections!
            const isNotReservedSpace = x % 2 === 1 || y % 2 === 1;

            if (isValidMove && isNotReservedSpace) {
                moveOptions.push([x, y]);
            }
        }
    }

    // Choose one of the found moves at random
    const randomIndex = Math.floor(Math.random() * moveOptions.length);
    return moveOptions[randomIndex] ?? [];
};

/** @param {NS} ns */
const getCapturingMove =  (ns, board, validMoves) => {
    const size = board[0].length;
    const liberties = ns.go.analysis.getLiberties();

    // Look through all the points on the board
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (validMoves[x][y] === true) {
                if(x > 0 && liberties[x-1][y] === 1) {
                    ns.print("Capturing move")
                    return [x, y];
                }
                if(y > 0 && liberties[x][y-1] === 1) {
                    ns.print("Capturing move")
                    return [x, y];
                }
                if(x+1 < size && liberties[x+1][y] === 1) {
                    ns.print("Capturing move")
                    return [x, y];
                }
                if(y+1 < size &&liberties[x][y+1] === 1) {
                    ns.print("Capturing move")
                    return [x, y];
                }
            }
        }
    }

    return null;
}