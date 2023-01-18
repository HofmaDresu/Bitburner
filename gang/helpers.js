const GANG_FLAGS_DATABASE_FILE = "/gang/flags.txt";


/** @param {NS} ns */
export function getWarPrepStatus(ns) {
    if (!ns.fileExists(GANG_FLAGS_DATABASE_FILE)) {
        ns.write(GANG_FLAGS_DATABASE_FILE, JSON.stringify({prepareForWar: false}), "w");
    }
    return JSON.parse(ns.read(GANG_FLAGS_DATABASE_FILE)).prepareForWar;
}

export function setWarPrepStatus(ns, shouldPrepareForWar) {
    if (!ns.fileExists(GANG_FLAGS_DATABASE_FILE)) {
        ns.write(GANG_FLAGS_DATABASE_FILE, JSON.stringify({prepareForWar: shouldPrepareForWar}), "w");
    } else {
        const flags = JSON.parse(ns.read(GANG_FLAGS_DATABASE_FILE));
        flags.prepareForWar = shouldPrepareForWar;
        ns.write(GANG_FLAGS_DATABASE_FILE, JSON.stringify(flags), "w");
    }
}