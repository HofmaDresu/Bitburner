/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	const contractFileName = arguments[0].args[1];
    const matrix = ns.codingcontract.getData(contractFileName, targetServer);
    let minWidthIndex = 0;
    let maxWidthIndex = matrix[0].length;
    let minHeightIndex = 0;
    let maxHeightIndex = matrix.length;
    let currentWidthIndex = 0;
    let currentHeightIndex = 0;
    let movementType = "w";
    let movementDirection = 1;
    const expectedLength = matrix.flatMap(i => i).length;
    /*
    for (let i = 0; i < matrix.length; i++) {
        ns.tprint(matrix[i].map(x => `${x}`.padStart(2, "0")).join(","))
    }
*/

    let spiralizedMatrix = [];

    while (minWidthIndex < maxWidthIndex || minHeightIndex < maxHeightIndex -1) {
        spiralizedMatrix.push(matrix[currentHeightIndex][currentWidthIndex]);

        if (movementType === "w") {
            const proposedIndex = currentWidthIndex + movementDirection;
            if (proposedIndex >= maxWidthIndex) {
                movementType = "h";
                currentHeightIndex += movementDirection;
                minHeightIndex++;
            } else if (proposedIndex < minWidthIndex) {
                movementType = "h";
                currentHeightIndex += movementDirection;
                maxHeightIndex--;
            } else {
                currentWidthIndex = proposedIndex;
            }
        } else if (movementType === "h") {
            const proposedIndex = currentHeightIndex + movementDirection;
            if (proposedIndex >= maxHeightIndex) {
                movementType = "w";
                movementDirection *= -1;
                currentWidthIndex += movementDirection;
                maxWidthIndex--;
            } else if (proposedIndex < minHeightIndex) {
                movementType = "w";
                movementDirection *= -1;
                currentWidthIndex += movementDirection;
                minWidthIndex++;
            } else {
                currentHeightIndex = proposedIndex;
            }
        }
    }

    
    // Horrible hack
    spiralizedMatrix = spiralizedMatrix.slice(0, expectedLength)
    
    const result = ns.codingcontract.attempt(spiralizedMatrix, contractFileName, targetServer, {returnReward: true});
    if (result) {
        ns.tprint(result);
    } else {
        ns.alert(`Failed Spiralize Matrix contract! ${targetServer} ${contractFileName}`);
    }
}