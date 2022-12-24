/** @param {NS} ns */
export async function main(ns) {
    const targetNum = arguments[0].args[0];

    const summations = [[targetNum - 1, 1]];

    while (summations[summations.length -1].length < targetNum) {
        const mostRecentSummation = summations[summations.length -1];
        const nonOneDigits = mostRecentSummation.filter(u => u > 1);
        const lastNonOneDigit = nonOneDigits[nonOneDigits.length-1];
        const oneDigits = mostRecentSummation.filter(u => u === 1);

        summations.push([...nonOneDigits.slice(0, nonOneDigits.length-2), lastNonOneDigit -1, 1, ...oneDigits]);
    }

    ns.tprint(summations)



    ns.tprint(summations.length);
    //ns.tprint(ns.codingcontract.attempt(profit, "contract-12740-NiteSec.cct", "computek", {returnReward: true}));
}

