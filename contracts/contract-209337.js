/** @param {NS} ns */
export async function main(ns) {
    const data = [7,125,58,5,84,130,57,66,122,137,7,184,171,142,124,182,57,34,154,93,79,188,142,142,172,94,19,95,165,92,44,192,122,59,117,39,94,182,200,102,139,140,177,167,173,118,177,200];
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

    const profit = possibleCombinations.sort((a, b) => b.totalProfit - a.totalProfit)[0].totalProfit;

    ns.tprint(profit);
    ns.tprint(ns.codingcontract.attempt(profit, "contract-209337.cct", "catalyst", {returnReward: true}));
}
    