
export const CRIMES = ["Shoplift", "Rob Store", "Mug", "Larceny", "Deal Drugs", "Bond Forgery", "Traffick Arms", "Homicide", "Grand Theft Auto", "Kidnap", "Assassination", "Heist"];

export function getTrainingCrime(ns) {
    const trainingCrime = CRIMES.map(c => ns.singularity.getCrimeStats(c))
        .map(c => ({type: c.type, avg_training_over_time: (((c.agility_exp + c.defense_exp + c.dexterity_exp + c.strength_exp) / 4) / c.time) * ns.singularity.getCrimeChance(c.type)}))
        .sort((a, b) => b.avg_training_over_time - a.avg_training_over_time)[0].type;
    return trainingCrime;
}

export function getMoneyCrime(ns) {
    const moneyCrime = CRIMES.map(c => ns.singularity.getCrimeStats(c))
        .map(c => ({type: c.type, money_over_time: (c.money / c.time) * ns.singularity.getCrimeChance(c.type)}))
        .sort((a, b) => b.money_over_time - a.money_over_time)[0].type;
    return moneyCrime;
}

export function getKarmaCrime(ns) {    
    const karmaCrime = CRIMES.map(c => ns.singularity.getCrimeStats(c))
        .map(c => ({type: c.type, karma_over_time: (c.karma / c.time) * ns.singularity.getCrimeChance(c.type)}))
        .sort((a, b) => b.karma_over_time - a.karma_over_time)[0].type;
    return karmaCrime;
}