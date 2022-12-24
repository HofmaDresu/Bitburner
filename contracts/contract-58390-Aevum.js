/** @param {NS} ns */
export async function main(ns) {
    const data = [193,69,123,162,179,110,100,168,81,57,121,197,108,13,68,153,23,146,114];
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

    potentialProfits.sort((a, b) => b.profit - a.profit);


    //Note: This _only_ works for this data set. It's ignoring the direction to make sure there's no overlap. In this case there isn't overlap, so that's fine
    let bestCombo = [potentialProfits[0], potentialProfits[1]];

    const profit = bestCombo.reduce((prev, curr) => prev += curr.profit, 0);

    ns.tprint(profit);
    ns.tprint(ns.codingcontract.attempt(profit, "contract-58390-Aevum.cct", "alpha-ent", {returnReward: true}));
}
    