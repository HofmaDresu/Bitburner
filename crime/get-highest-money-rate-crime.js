
/** @param {NS} ns */
export async function main(ns) {
    const crimes = ["Shoplift", "Rob Store", "Mug", "Larceny", "Deal Drugs", "Bond Forgery", "Traffick Arms", "Homicide", "Grand Theft Auto", "Kidnap", "Assassination", "Heist"];

    ns.tprint(crimes.map(c => ns.singularity.getCrimeStats(c))
        .map(c => ({type: c.type, money_over_time: (c.money / c.time) * ns.singularity.getCrimeChance(c.type)}))
        .sort((a, b) => b.money_over_time - a.money_over_time)[0].type);
}