
/** @param {NS} ns */
export async function main(ns) {
    const crimes = ["Shoplift", "Rob Store", "Mug", "Larceny", "Deal Drugs", "Bond Forgery", "Traffick Arms", "Homicide", "Grand Theft Auto", "Kidnap", "Assassination", "Heist"];

    const trainingCrime = crimes.map(c => ns.singularity.getCrimeStats(c))
        .map(c => ({type: c.type, avg_training_over_time: (((c.agility_exp + c.defense_exp + c.dexterity_exp + c.strength_exp) / 4) / c.time) * ns.singularity.getCrimeChance(c.type)}))
        .sort((a, b) => b.avg_training_over_time - a.avg_training_over_time)[0].type;
    ns.tprint(trainingCrime);
    return trainingCrime;
}