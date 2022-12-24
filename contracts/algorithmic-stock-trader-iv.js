/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	const contractFileName = arguments[0].args[1];
    const data = ns.codingcontract.getData(contractFileName, targetServer);
    const maxDepth = data[0];
    const stockPrices = data[1];
    
    let potentialActions = [];
    for (let buyIndex = 0; buyIndex <stockPrices.length; buyIndex++) {
        for (let sellIndex = buyIndex; sellIndex < stockPrices.length; sellIndex++) {
            potentialActions.push({
                buyIndex: buyIndex,
                sellIndex: sellIndex,
                profit: stockPrices[sellIndex] - stockPrices[buyIndex]
            });
        }
    }

    potentialActions = potentialActions.filter(pp => pp.profit > 0).sort((a, b) => a.buyIndex - b.buyIndex);

    const profit = getMaxProfit(ns, potentialActions, 0, maxDepth);

    const result = ns.codingcontract.attempt(profit, contractFileName, targetServer, {returnReward: true});
    if (result) {
        ns.tprint(result);
    } else {
        ns.alert(`Failed algorithmic stock trader IV contract! ${targetServer} ${contractFileName}`);
    }
}

function getMaxProfit(ns, potentialActions, currentDepth, maxDepth) {
    if (currentDepth === maxDepth) return 0;
    const potentialProfits = [];
    for (let profitIndex = 0; profitIndex < potentialActions.length; profitIndex++) {
        const currentSale = potentialActions[profitIndex];
        const additionalPotentialActions = potentialActions.slice(profitIndex).filter(pp => pp.buyIndex > currentSale.sellIndex);

        if (additionalPotentialActions.length) {
            potentialProfits.push(currentSale.profit + getMaxProfit(ns, additionalPotentialActions, currentDepth + 1, maxDepth));
        } else {
            potentialProfits.push(currentSale.profit);
        }
    }
    return potentialProfits.sort((a, b) => b - a)[0];
}