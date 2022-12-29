/** @param {NS} ns */
export async function main(ns) {
    const targetNum = arguments[0].args[0];

    const currentSummation = [targetNum - 1, 1];
    const ones = 0;

    const summations = findSummations(ns, targetNum, currentSummation, ones, 1);

    ns.tprint(summations)


    //ns.tprint(ns.codingcontract.attempt(profit, "contract-12740-NiteSec.cct", "computek", {returnReward: true}));
}

// TODO: Make iterative

function findSummations(ns, targetSum, currentSummation, ones, numberOfSummations) {
    ns.tprint(`${currentSummation} ones: ${ones}`)
    if (ones === targetSum) return numberOfSummations
    if (currentSummation.length === 1 && currentSummation[currentSummation.length-1] === 1) return numberOfSummations;
    if (currentSummation.length === currentSummation.filter(x => x === 1).length) return numberOfSummations;

    if (currentSummation[currentSummation.length-1] !== 1 && ones === currentSummation[currentSummation.length-1]) {
        //ns.tprint("new")
        currentSummation.push(ones);
        ones = 0;
        return findSummations(ns, targetSum, currentSummation, ones, numberOfSummations + 1);
    } else if (currentSummation[currentSummation.length-1] > 1) {
       //ns.tprint("Last digit not one")
        currentSummation[currentSummation.length-1]--;
        ones++;
        return findSummations(ns, targetSum, currentSummation, ones, numberOfSummations + 1);
    } else {
        //ns.tprint("rebuild")
        // Only rebuilds last number, not subsequent
        currentSummation = currentSummation.slice(0, currentSummation.length-1);
        currentSummation[currentSummation.length-1]--;

        for (let i = currentSummation[currentSummation.length-1]; i > 1;){
            const partialSum = currentSummation.reduce((prev, curr) => prev += curr);
            if (partialSum + i <= targetSum) {
                currentSummation.push(i);
            } else {
                i--;
            }
        }
        
        ones = targetSum - currentSummation.reduce((prev, curr) => prev += curr);

        // Causes crash
        /*
        while (ones >= currentSummation[currentSummation.length-1]) {
            ones -= currentSummation[currentSummation.length-1];
            currentSummation.push(currentSummation[currentSummation.length-1]);
        }
        */

        return findSummations(ns, targetSum, currentSummation, ones, numberOfSummations + 1);
    }
}