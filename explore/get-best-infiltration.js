/** @param {NS} ns */
export async function main(ns) {
	ns.tprint(ns.infiltration.getPossibleLocations().map(l => {
		const info = ns.infiltration.getInfiltration(l.name);
		return {
			name: l.name,
			city: l.city,
			difficulty: info.difficulty, 
			reward: info.reward.tradeRep,
		};
	}).filter(i => i.difficulty < 1.5).sort((a, b) => b.reward - a.reward));

}
