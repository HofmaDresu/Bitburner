
/** @param {NS} ns */
export async function main(ns) {
    const crimes = ["Shoplift", "Rob Store", "Mug", "Larceny", "Deal Drugs", "Bond Forgery", "Traffick Arms", "Homicide", "Grand Theft Auto", "Kidnap", "Assassination", "Heist"];

    ns.tprint(crimes.map(c => ns.singularity.getCrimeStats(c)).sort((a, b) => (b.money / b.time) - (a.money - a.time))[0].type);
}