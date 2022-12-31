/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	const contractFileName = arguments[0].args[1];
    const data = ns.codingcontract.getData(contractFileName, targetServer);
    
    let potentialProfits = [];
    for (let buyIndex = 0; buyIndex < data.length; buyIndex++) {
        for (let sellIndex = buyIndex; sellIndex < data.length; sellIndex++) {
            potentialProfits.push({
                buyIndex: buyIndex,
                sellIndex: sellIndex,
                profit: data[sellIndex] - data[buyIndex]
            });
        }
    }

    potentialProfits = potentialProfits.filter(pp => pp.profit > 0).sort((a, b) => a.buyIndex - b.buyIndex);


    // Only works for 2 purchases. This may wor for all contracts of this style
    let possibleCombinations = [];
    for (let i = 0; i < potentialProfits.length; i++) {
        for (let j = i+1; j < potentialProfits.length; j++) {
            if (potentialProfits[j].buyIndex > potentialProfits[i].sellIndex) {
                possibleCombinations.push({
                    firstIndex: i,
                    secondIndex: j,
                    totalProfit: potentialProfits[j].profit + potentialProfits[i].profit
                })
            }
        }
    }

    const profit = possibleCombinations.sort((a, b) => b.totalProfit - a.totalProfit)[0]?.totalProfit || 0;

    const result = ns.codingcontract.attempt(profit, contractFileName, targetServer, {returnReward: true});
    if (result) {
        ns.tprint(result);
    } else {
        ns.alert(`Failed algorithmic stock trader III contract! ${targetServer} ${contractFileName}`);
    }
}
    