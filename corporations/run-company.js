
/** @param {NS} ns */
export async function main(ns) {
    const constants = ns.corporation.getConstants();
    const cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];

    if (!ns.corporation.hasUnlockUpgrade("Smart Supply")) {
        ns.corporation.unlockUpgrade("Smart Supply");
    }

    if (ns.corporation.getUpgradeLevel("DreamSense") === 0) {
        ns.corporation.levelUpgrade("DreamSense")
    }

    while(true) {
        let corporation = ns.corporation.getCorporation();
        corporation.divisions.forEach(divisionName => {
            corporation = ns.corporation.getCorporation();
            let division = ns.corporation.getDivision(divisionName);
            const industry = ns.corporation.getIndustryData(division.type);


            if (division.cities.length < cities.length && constants.officeInitialCost + constants.warehouseInitialCost < corporation.funds) {
                const targetCity = cities.filter(c => !division.cities.includes(c))[0];
                ns.corporation.expandCity(divisionName, targetCity);            
                ns.corporation.purchaseWarehouse(divisionName, cityName);                    
                if (industry.producedMaterials) {
                    industry.producedMaterials.forEach(materialName => {
                        ns.corporation.sellMaterial(divisionName, targetCity, materialName, "MAX", "MP");
                    });
                }
            }


            division.cities.forEach(cityName => {
                corporation = ns.corporation.getCorporation();
                
                let office = ns.corporation.getOffice(divisionName, cityName);

                // EMPLOYEES
                // TODO: Don't do this if we have caffine research
                if (office.avgEne < office.maxEne * .75 && corporation.funds > 500_000 * office.employees) {
                    ns.corporation.buyCoffee(divisionName, cityName);
                }
                corporation = ns.corporation.getCorporation();
                // TODO: Don't do this if we have party research
                if ((office.avgHap < office.maxHap * .6 || office.avgMor < office.maxMor * .6) && corporation.funds > 10_000_000 * office.employees) {
                    ns.corporation.throwParty(divisionName, cityName, 10_000_000)
                }
                while (office.employees < office.size) {
                    const targetJobs = Object.keys(office.employeeJobs).filter(key => !["Training", "Unassigned"].includes(key));
                    // TODO: Something smarter than even placement
                    // Idea: equal Ops and Eng, .5 Management, equal Research if stuff to research, .25 Business
                    const jobToFill = targetJobs.sort((a, b) => office.employeeJobs[a] - office.employeeJobs[b])[0];

                    ns.corporation.hireEmployee(divisionName, cityName, jobToFill);
                    
                    office = ns.corporation.getOffice(divisionName, cityName);
                }
                //TODO: train and rebalance employees

                // WAREHOUSE
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

        // If has product and fewer than max, create at 1_000_000_000/1_000_000_000

        // Expand warehouse

        // if no current industry
            // If can afford, start one

        await ns.sleep(constants.secondsPerMarketCycle * 2 * 1000);
    }
}

function getBestMultiplierSupply(ns, industry) {
    const highestFactor = Math.max(industry.hardwareFactor || 0, industry.realEstateFactor || 0, industry.aiCoreFactor || 0, industry.robotFactor || 0);
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