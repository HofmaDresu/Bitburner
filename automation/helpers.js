const FACTION_AUGMENT_DB_FILENAME = '/automation/factionAugmentData.txt';

/** @param {NS} ns */
export function getFactionDB(ns) {
    if (ns.read(FACTION_AUGMENT_DB_FILENAME) === '') {
        updateFactionDB(ns, {});
    }
    return JSON.parse(ns.read(FACTION_AUGMENT_DB_FILENAME));
}

export function updateFactionDB(ns, updatedData) {
    ns.write(FACTION_AUGMENT_DB_FILENAME, JSON.stringify(updatedData), "w");
}

const CITY_ORDER = [['Sector-12'], ['Chongqing', 'New Tokyo', 'Ishima'], ['Aevum'], ['Volhaven']];
const CITY_REQUIREMENTS = {
    'Sector-12': 215_000_000,
    'Chongqing': 20_000_000,
    'New Tokyo': 20_000_000,
    'Ishima': 30_000_000,
    'Aevum': 40_000_000,
    'Volhaven': 50_000_000,
};
