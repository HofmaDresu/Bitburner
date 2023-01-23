
/** @param {NS} ns */
export async function main(ns) {
    const constants = ns.corporation.getConstants();

    if (!ns.corporation.hasUnlockUpgrade("Smart Supply")) {
        ns.corporation.unlockUpgrade("Smart Supply");
    }

    if (ns.corporation.getUpgradeLevel("DreamSense") === 0) {
        ns.corporation.levelUpgrade("DreamSense")
    }

    while(true) {
        let corporation = ns.corporation.getCorporation();
        corporation.divisions.forEach(divisionName => {
            let division = ns.corporation.getDivision(divisionName);
            const industry = ns.corporation.getIndustryData(division.type);
            division.cities.forEach(cityName => {
                corporation = ns.corporation.getCorporation();
                let office = ns.corporation.getOffice(divisionName, cityName);
                // TODO: Don't do this if we have caffine research
                if (office.avgEne < office.maxEne * .75 && corporation.funds > 500_000 * office.employees) {
                    ns.corporation.buyCoffee(divisionName, cityName);
                }
                corporation = ns.corporation.getCorporation();
                // TODO: Don't do this if we have party research
                if ((office.avgHap < office.maxHap * .6 || office.avgMor < office.maxMor * .6) && corporation.funds > 10_000_000 * office.employees) {
                    ns.corporation.throwParty(divisionName, cityName, 10_000_000)
                }

                if (ns.corporation.hasWarehouse(divisionName, cityName)) {
                    // TODO: If have proper research, bulk purchase
                    let warehouse = ns.corporation.getWarehouse(divisionName, cityName);
                    const materialName = getBestMultiplierSupply(ns, industry);
                    ns.corporation.setSmartSupplyUseLeftovers(divisionName, cityName, materialName, false);
                    if (warehouse.sizeUsed < warehouse.size * .5) {
                        ns.corporation.setSmartSupply(divisionName, cityName, false);
                        ns.corporation.buyMaterial(divisionName, cityName, materialName, 10);
                    } else {
                        ns.corporation.buyMaterial(divisionName, cityName, materialName, 0);
                        ns.corporation.setSmartSupply(divisionName, cityName, true);
                    }
                } else if(constants.warehouseInitialCost < corporation.funds) {        
                    corporation = ns.corporation.getCorporation();            
                    ns.corporation.purchaseWarehouse(divisionName, cityName);
                }
            });
        });

        constants.upgradeNames.forEach(upgradeName => {
            corporation = ns.corporation.getCorporation();
            if (ns.corporation.getUpgradeLevelCost(upgradeName) < corporation.funds) {
                ns.corporation.levelUpgrade(upgradeName);
            }
        });

        constants.unlockNames.forEach(unlockName => {
            corporation = ns.corporation.getCorporation();
            if (ns.corporation.getUnlockUpgradeCost(unlockName) < corporation.funds) {
                ns.corporation.unlockUpgrade(unlockName);
            }
        });

        // Get current industry (active && !(fullyExpanded && allEmployees))
            // if not fully expanded
                // expand as able
                    // start sales of correct stuff
            // if not fully employeed but fully expanded
                // expand office
                // distribute employees
            // if fully expanded
                // Purchase any Unlocks or Upgrades we can afford
            // If has product and fewer than max, create at 1_000_000_000/1_000_000_000


            // if no current industry
                // If can afford, start one

        await ns.sleep(constants.secondsPerMarketCycle * 2 * 1000);
    }
}

function getBestMultiplierSupply(ns, industry) {
    const highestFactor = Math.max(industry.hardwareFactor || 0, industry.realEstateFactor || 0, industry.aiCoreFactor || 0, industry.robotFactor || 0);
    ns.tprint(highestFactor)
    ns.tprint(industry)
    switch (highestFactor) {
        case industry.hardwareFactor:
            return "Hardware";
        case industry.realEstateFactor:
            return "Real Estate";
        case industry.aiCoreFactor:
            return "AI Cores";
        case industry.robotFactor:
            return "Robots";
    }
}