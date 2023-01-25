
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

    if (!ns.corporation.hasUnlockUpgrade("Market Research - Demand")) {
        ns.corporation.unlockUpgrade("Market Research - Demand")
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

            if (division.makesProducts) {
                division.products.forEach(productName => {
                    const product = ns.corporation.getProduct(divisionName, productName);
                    const isReady = product.developmentProgress === 100;
                    const notSelling = Object.keys(product.cityData).every(cn => product.cityData[cn][2] === 0);
                    const noDemand = Object.keys(product.cityData).every(cn => product.cityData[cn].demand === 0);
                    if (isReady && notSelling) {
                        ns.corporation.sellProduct(divisionName, cityName, productName, "MAX", "MP", true);
                    }
                    if (isReady && noDemand) {
                        ns.corporation.discontinueProduct(divisionName, productName)
                    }
                });

                const maxProducts = 3 + (ns.corporation.hasResearched(division.name, "uPgrade: Capacity.I") ? 1 : 0) + (ns.corporation.hasResearched(division.name, "uPgrade: Capacity.II") ? 1 : 0);
                if (division.products.length < maxProducts && corporation.funds < 2_000_000_000) {
                    const bestCity = division.cities.sort((a, b) => ns.corporation.getOffice(divisionName, b).employees - ns.corporation.getOffice(divisionName, a).employees)[0];
                    ns.corporation.makeProduct(divisionName, bestCity, crypto.randomUUID(), 1_000_000_000, 1_000_000_000);
                }
            }

            divisionResearch(ns, division, industry.product ? constants.researchNames : constants.researchNamesBase);
            corporation = ns.corporation.getCorporation();


            division.cities.forEach(cityName => {
                corporation = ns.corporation.getCorporation();
                
                let office = ns.corporation.getOffice(divisionName, cityName);

                // EMPLOYEES
                if (office.avgEne < office.maxEne * .75 && corporation.funds > 500_000 * office.employees) {
                    ns.corporation.buyCoffee(divisionName, cityName);
                }
                corporation = ns.corporation.getCorporation();
                if ((office.avgHap < office.maxHap * .6 || office.avgMor < office.maxMor * .6) && corporation.funds > 10_000_000 * office.employees) {
                    ns.corporation.throwParty(divisionName, cityName, 10_000_000)
                }
                corporation = ns.corporation.getCorporation();

                if (ns.corporation.getOfficeSizeUpgradeCost(divisionName, cityName, 3) < corporation.funds) {
                    ns.corporation.upgradeOfficeSize(divisionName, cityName, 3);
                }
                corporation = ns.corporation.getCorporation();

                while (office.employees < office.size) {
                    const targetJobs = Object.keys(office.employeeJobs).filter(key => !["Unassigned"].includes(key));
                    // TODO: Something smarter than even placement
                    // Idea: equal Ops and Eng, .5 Management, equal Research if stuff to research, .25 Business
                    const jobToFill = targetJobs.sort((a, b) => office.employeeJobs[a] - office.employeeJobs[b])[0];

                    ns.corporation.hireEmployee(divisionName, cityName, jobToFill);
                    
                    office = ns.corporation.getOffice(divisionName, cityName);
                }

                // WAREHOUSE
                if (ns.corporation.hasWarehouse(divisionName, cityName)) {
                    corporation = ns.corporation.getCorporation();                    

                    if (ns.corporation.getUpgradeWarehouseCost(divisionName, cityName) < corporation.funds) {
                        ns.corporation.upgradeWarehouse(divisionName, cityName);
                    }

                    let warehouse = ns.corporation.getWarehouse(divisionName, cityName);
                    const materialName = getBestMultiplierSupply(ns, industry);
                    ns.corporation.setSmartSupplyUseLeftovers(divisionName, cityName, materialName, false);
                    if (warehouse.sizeUsed < warehouse.size * .5) {
                        ns.corporation.setSmartSupply(divisionName, cityName, false);
                        ns.corporation.buyMaterial(divisionName, cityName, materialName, warehouse.size * .1);
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
        
        // if no current industry
            // If can afford, start one

        await ns.sleep(constants.secondsPerMarketCycle * 2 * 1000);
    }
}

/** @param {NS} ns, @param {Division} division, @param {CorpResearchName} potentialResearches */
function divisionResearch(ns, division, potentialResearches) {
    if (!ns.corporation.hasResearched(division.name, "AutoBrew") && ns.corporation.getResearchCost(division.name, "AutoBrew") < division.research) {
        ns.corporation.research(division.name, "AutoBrew");
    } else if (ns.corporation.hasResearched(division.name, "AutoBrew") ** !ns.corporation.hasResearched(division.name, "AutoPartyManager") && ns.corporation.getResearchCost(division.name, "AutoPartyManager") < division.research) {
        ns.corporation.research(division.name, "AutoPartyManager");
    } else if (ns.corporation.hasResearched(division.name, "AutoBrew") && ns.corporation.hasResearched(division.name, "AutoBrew")) {
        potentialResearches.forEach(research => {
            if (!ns.corporation.hasResearched(division.name, research) && ns.corporation.getResearchCost(division.name, research) < division.research) {
                ns.corporation.research(division.name, research);
            }
        })
    }
}

/** @param {NS} ns, @param {CorpIndustryData} industry */
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