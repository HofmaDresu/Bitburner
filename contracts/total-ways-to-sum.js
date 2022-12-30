/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	const contractFileName = arguments[0].args[1];
    const targetSum = 8 // ns.codingcontract.getData(contractFileName, targetServer);

    let currentSummation = [targetSum - 1];
    let ones = 1;

    let totalSummations = 1;
    while(true) { 
        ns.tprint(`${currentSummation}, ones: ${ones}`);
        if (ones === targetSum) {
            break;
        }
        if (currentSummation.length === 1 && currentSummation[currentSummation.length-1] === 1) {
            break;
        }
        if (currentSummation.length === currentSummation.filter(x => x === 1).length) {
            break;
        }
        

        if (currentSummation[currentSummation.length-1] !== 1 && ones === currentSummation[currentSummation.length-1]) {
            currentSummation.push(ones);
            ones = 0;
            totalSummations++;
        } else if (currentSummation[currentSummation.length-1] > 1) {
            currentSummation[currentSummation.length-1]--;
            ones++;
            totalSummations++;
        } else {
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
            totalSummations++;
        }
    }

    ns.tprint(totalSummations);
/*
    const result = ns.codingcontract.attempt(totalSummations, contractFileName, targetServer, {returnReward: true});
    if (result) {
        ns.tprint(result);
    } else {
        ns.alert(`Failed Total Ways To Sum contract! ${targetServer} ${contractFileName}`);
    }*/
}