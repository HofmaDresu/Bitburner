
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    while(!ns.corporation.hasCorporation()) {
        if (ns.getServerMoneyAvailable("home") > 150_000_000_000) {
            ns.corporation.createCorporation(crypto.randomUUID(), true);
        }
        await ns.sleep(60_000);
    }

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
                ns.corporation.purchaseWarehouse(divisionName, targetCity);                    
                if (industry.producedMaterials) {
                    industry.producedMaterials.forEach(materialName => {
                        //TODO: Split out from expansion script to allow adjustments
                        //TODO: use Market TA II
                        ns.corporation.sellMaterial(divisionName, targetCity, materialName, "MAX", "MP");
                    });
                }
            }

            if (division.makesProducts) {
                const bestCity = division.cities.sort((a, b) => ns.corporation.getOffice(divisionName, b).employees - ns.corporation.getOffice(divisionName, a).employees)[0];
                division.products.forEach(productName => {
                    const product = ns.corporation.getProduct(divisionName, productName);
                    const isReady = product.developmentProgress === 100;
                    const notSelling = Object.keys(product.cityData).every(cn => product.cityData[cn][2] === 0);
                    const noDemand =  product.dmd < 1;
                    if (isReady && notSelling) {
                        //TODO: use Market TA II, split out to allow adjustments
                        ns.corporation.sellProduct(divisionName, bestCity, productName, "MAX", "MP", true);
                    }
                    if (isReady && noDemand) {
                        ns.corporation.discontinueProduct(divisionName, productName)
                    }
                });

                const maxProducts = 3 + (ns.corporation.hasResearched(division.name, "uPgrade: Capacity.I") ? 1 : 0) + (ns.corporation.hasResearched(division.name, "uPgrade: Capacity.II") ? 1 : 0);
                const minProductInvestment = 1_000_000;
                const maxProductInvestment = 1_000_000_000;
                const targetProductInvestment = Math.min(maxProductInvestment, Math.max(minProductInvestment, corporation.funds / 2));
                if (division.products.length < maxProducts && corporation.funds >= targetProductInvestment * 2 && division.products.every(productName => ns.corporation.getProduct(divisionName, productName).developmentProgress === 100)) {
                    ns.corporation.makeProduct(divisionName, bestCity, crypto.randomUUID(), targetProductInvestment, targetProductInvestment);
                }
            }

            divisionResearch(ns, division, (industry.product ? constants.researchNames : constants.researchNamesBase).filter(r => !["HRBuddy-Recruitment", "HRBuddy-Training"].includes(r)));
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

                if (ns.corporation.getOfficeSizeUpgradeCost(divisionName, cityName, office.employees * 2) < corporation.funds) {
                    ns.corporation.upgradeOfficeSize(divisionName, cityName, office.employees * 2);
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
                    let warehouse = ns.corporation.getWarehouse(divisionName, cityName);              

                    if (warehouse.level < 5 && ns.corporation.getUpgradeWarehouseCost(divisionName, cityName) < corporation.funds) {
                        ns.corporation.upgradeWarehouse(divisionName, cityName);
                        warehouse = ns.corporation.getWarehouse(divisionName, cityName);   
                    }

                    const materialName = getBestMultiplierSupply(ns, industry);
                    ns.corporation.setSmartSupplyUseLeftovers(divisionName, cityName, materialName, false);
                    if (warehouse.sizeUsed < warehouse.size * .5) {
                        ns.corporation.setSmartSupply(divisionName, cityName, false);
                        ns.corporation.buyMaterial(divisionName, cityName, materialName, warehouse.size * .01);
                    } else {
                        ns.corporation.buyMaterial(divisionName, cityName, materialName, 0);
                        ns.corporation.setSmartSupply(divisionName, cityName, true);
                    }
                }
            });
        });
        
        constants.upgradeNames.forEach(upgradeName => {
            corporation = ns.corporation.getCorporation();
            const upgradeLevel = ns.corporation.getUpgradeLevel(upgradeName);

            if (corporation.divisions.length === constants.industryNames.length || upgradeLevel < corporation.divisions.length * 10) {
                if (ns.corporation.getUpgradeLevelCost(upgradeName) < corporation.funds) {
                    ns.corporation.levelUpgrade(upgradeName);
                }
            }
        });

        constants.unlockNames.forEach(unlockName => {
            corporation = ns.corporation.getCorporation();
            if (!ns.corporation.hasUnlockUpgrade(unlockName) && ns.corporation.getUnlockUpgradeCost(unlockName) < corporation.funds) {
                ns.corporation.unlockUpgrade(unlockName);
            }
        });

        const availableIndustries = constants.industryNames
            .filter(indName => !corporation.divisions.some(d => ns.corporation.getDivision(d).type === indName))
            .map(indName => ({name: indName, startingCost: ns.corporation.getIndustryData(indName).startingCost, producesMaterials: !!ns.corporation.getIndustryData(indName).producedMaterials}))
            .filter(ind => corporation.divisions.length > 0 || ind.producesMaterials)
            .sort((a, b) => a.startingCost - b.startingCost);
        if (availableIndustries.length > 0 && corporation.divisions.every(divisionName =>  ns.corporation.getDivision(divisionName).cities.length === cities.length)) {
            const nextIndustry = availableIndustries[0];
            corporation = ns.corporation.getCorporation();
            if (nextIndustry.startingCost < corporation.funds) {
                ns.corporation.expandIndustry(nextIndustry.name, nextIndustry.name);
            }
        }

        await ns.sleep(constants.secondsPerMarketCycle * 2 * 1000);
    }
}

/** @param {NS} ns, @param {Division} division, @param {CorpResearchName} potentialResearches */
function divisionResearch(ns, division, potentialResearches) {
    if (!ns.corporation.hasResearched(division.name, "Hi-Tech R&D Laboratory") && ns.corporation.getResearchCost(division.name, "Hi-Tech R&D Laboratory") < division.research) {
        ns.corporation.research(division.name, "Hi-Tech R&D Laboratory");
    } else if (!ns.corporation.hasResearched(division.name, "AutoBrew") && ns.corporation.getResearchCost(division.name, "AutoBrew") < division.research) {
        ns.corporation.research(division.name, "AutoBrew");
    } else if (ns.corporation.hasResearched(division.name, "AutoBrew") && !ns.corporation.hasResearched(division.name, "AutoPartyManager") && ns.corporation.getResearchCost(division.name, "AutoPartyManager") < division.research) {
        ns.corporation.research(division.name, "AutoPartyManager");
    } else if (ns.corporation.hasResearched(division.name, "AutoBrew") && ns.corporation.hasResearched(division.name, "AutoBrew")) {
        potentialResearches.forEach(research => {
            if (!ns.corporation.hasResearched(division.name, research) && ns.corporation.getResearchCost(division.name, research) < division.research) {
                ns.corporation.research(division.name, research);
                division = ns.corporation.getDivision(division.name);
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