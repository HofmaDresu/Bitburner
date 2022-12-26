/** @param {NS} ns */
export async function main(ns) {
	const targetServer = arguments[0].args[0];
	const contractFileName = arguments[0].args[1];
    const data = ns.codingcontract.getData(contractFileName, targetServer);
    
    let potentialActions = [];
    for (let buyIndex = 0; buyIndex < data.length; buyIndex++) {
        for (let sellIndex = buyIndex; sellIndex < data.length; sellIndex++) {
            potentialActions.push({
                buyIndex: buyIndex,
                sellIndex: sellIndex,
                profit: data[sellIndex] - data[buyIndex]
            });
        }
    }

    potentialActions = potentialActions.filter(pp => pp.profit > 0).sort((a, b) => a.buyIndex - b.buyIndex);


    const profit = await getMaxProfit(ns, potentialActions, 0);

    const result = ns.codingcontract.attempt(profit, contractFileName, targetServer, {returnReward: true});
    if (result) {
        ns.tprint(result);
    } else {
        ns.alert(`Failed algorithmic stock trader II contract! ${targetServer} ${contractFileName}`);
    }
}

async function getMaxProfit(ns, potentialActions, currentDepth) {
    const potentialProfits = [];
    for (let profitIndex = 0; profitIndex < potentialActions.length; profitIndex++) {
        const currentSale = potentialActions[profitIndex];
        const additionalPotentialActions = potentialActions.slice(profitIndex).filter(pp => pp.buyIndex > currentSale.sellIndex);
        if (additionalPotentialActions.length) {
            potentialProfits.push(currentSale.profit + await getMaxProfit(ns, additionalPotentialActions, currentDepth + 1));
        } else {
            potentialProfits.push(currentSale.profit);
        }
        await ns.sleep(5);
    }
    return potentialProfits.sort((a, b) => b - a)[0];
}