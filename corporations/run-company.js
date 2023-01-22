
/** @param {NS} ns */
export async function main(ns) {
    // TODO: dynamic. Do we even need this?
    const industryStatus = {
        "Computer Hardware": {isActive: false, isFullyExpanded: false, hasAllEmployees: false},
        //TODO: Add industries
    };

    if (!ns.corporation.hasUnlockUpgrade("Smart Supply")) {
        ns.corporation.unlockUpgrade("Smart Supply");
    }

    if (ns.corporation.getUpgradeLevel("DreamSense") === 0) {
        ns.corporation.levelUpgrade("DreamSense")
    }

    while(true) {
        // Get current industry (active && !(fullyExpanded && allEmployees))
        // for all divisions
            // If energy < 75 buy coffee
            // If morale or happiness < 60 throw party for 10_000_000
        // if not fully expanded
            // expand as able
                // turn on smart supply
                // start sales of correct stuff
                // maybe buy some amount of multiplier equipment
        // if not fully employeed but fully expanded
            // expand office
            // distribute employees
        // if fully expanded
            // Purchase any Unlocks or Upgrades we can afford

        // if no current industry
            // If can afford, start one
            // If has product, create at 1_000_000_000/1_000_000_000

        await ns.sleep(60000);
    }
}