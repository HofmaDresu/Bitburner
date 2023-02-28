
/** @param {NS} ns */
export async function main(ns) {
    const crimes = ["Shoplift", "Rob Store", "Mug", "Larceny", "Deal Drugs", "Bond Forgery", "Traffick Arms", "Homicide", "Grand Theft Auto", "Kidnap", "Assassination", "Heist"];

    const karmaCrime = crimes.map(c => ns.singularity.getCrimeStats(c))
        .map(c => ({type: c.type, karma_over_time: (c.karma / c.time) * ns.singularity.getCrimeChance(c.type)}))
        .sort((a, b) => b.karma_over_time - a.karma_over_time)[0].type;
    ns.tprint(karmaCrime);
    return karmaCrime;
}