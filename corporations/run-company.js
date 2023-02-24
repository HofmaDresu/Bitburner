
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    ns.disableLog("getServerMoneyAvailable");
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
            corporation = runDivision(corporation, ns, divisionName, cities, constants);
        });
        
        corporation = upgradeCorporation(constants, corporation, ns);

        corporation = expandIndustry(constants, corporation, ns, cities);

        handleShares(ns, corporation, constants, cities);

        await ns.sleep(constants.secondsPerMarketCycle * 2 * 1000);
    }
}

/** @param {NS} ns, @param {CorporationInfo} corporation */
function handleShares(ns, corporation, constants, cities) {
    if (!corporation.public) {
        if (corporation.revenue > 20) {
            ns.corporation.goPublic(corporation.totalShares);
        } else {
            return;
        }
    }
    
    const availableIndustries = constants.industryNames
        .filter(indName => !corporation.divisions.some(d => ns.corporation.getDivision(d).type === indName));
    if (availableIndustries.length > 0 || !corporation.divisions.every(divisionName => ns.corporation.getDivision(divisionName).cities.length === cities.length)) {
        //if (corporation.shareSaleCooldown === 0) { // always 0??
        try {
            ns.corporation.issueNewShares();
        } catch {}
    } else {
        ns.corporation.issueDividends(.1);
    }

    if (corporation.issuedShares > 0) {
        const affordableShares = Math.floor(Math.min(ns.getServerMoneyAvailable("home") / corporation.sharePrice, corporation.issuedShares));
        ns.corporation.buyBackShares(affordableShares);
    }
}

function runDivision(corporation, ns, divisionName, cities, constants) {
    corporation = ns.corporation.getCorporation();
    let division = ns.corporation.getDivision(divisionName);
    const industry = ns.corporation.getIndustryData(division.type);


    division = expandCity(division, cities, constants, corporation, ns, divisionName, industry);

    makeProductsAsNeeded(division, ns, corporation);

    divisionResearch(ns, division, (industry.product ? constants.researchNames : constants.researchNamesBase).filter(r => !["HRBuddy-Recruitment", "HRBuddy-Training"].includes(r)));
    corporation = ns.corporation.getCorporation();


    division.cities.forEach(cityName => {
        corporation = runCity(corporation, ns, divisionName, cityName, industry);
    });
    return corporation;
}

/** @param {Division} division, @param {NS} ns, @param {CorporationInfo} corporation */
function runCity(corporation, ns, divisionName, cityName, industry) {
    corporation = ns.corporation.getCorporation();

    let office = ns.corporation.getOffice(divisionName, cityName);
    
    corporation = manageWarehouse(ns, divisionName, cityName, corporation, industry, office.employees);

    
    if (industry.producedMaterials) {
        industry.producedMaterials.forEach(materialName => {
            if (ns.corporation.hasResearched(divisionName, "Market-TA.II")) {
                ns.corporation.setMaterialMarketTA2(divisionName, cityName, materialName, true);
            } else {
                ns.corporation.sellMaterial(divisionName, cityName, materialName, "MAX", "MP");
            }
        });
    }

    ({ office, corporation } = manageEmployees(office, corporation, ns, divisionName, cityName));

    return corporation;
}

function manageWarehouse(ns, divisionName, cityName, corporation, industry, employees) {
    if (ns.corporation.hasWarehouse(divisionName, cityName)) {
        corporation = ns.corporation.getCorporation();
        let warehouse = ns.corporation.getWarehouse(divisionName, cityName);

        if (warehouse.level < employees / 3 && ns.corporation.getUpgradeWarehouseCost(divisionName, cityName) < corporation.funds) {
            ns.corporation.upgradeWarehouse(divisionName, cityName);
            warehouse = ns.corporation.getWarehouse(divisionName, cityName);
        }

        const materialName = getBestMultiplierSupply(ns, industry);
        ns.corporation.setSmartSupplyUseLeftovers(divisionName, cityName, materialName, false);
        if (warehouse.sizeUsed < warehouse.size * .5) {
            ns.corporation.setSmartSupply(divisionName, cityName, false);
            // TODO: take production needs into account
            ns.corporation.buyMaterial(divisionName, cityName, materialName, warehouse.size * .05);
        } else {
            ns.corporation.buyMaterial(divisionName, cityName, materialName, 0);
            ns.corporation.setSmartSupply(divisionName, cityName, true);
        }
    }
    return corporation;
}

function manageEmployees(office, corporation, ns, divisionName, cityName) {
    if (office.avgEne < office.maxEne * .75 && corporation.funds > 500000 * office.employees) {
        ns.corporation.buyCoffee(divisionName, cityName);
    }
    corporation = ns.corporation.getCorporation();
    if ((office.avgHap < office.maxHap * .6 || office.avgMor < office.maxMor * .6) && corporation.funds > 10000000 * office.employees) {
        ns.corporation.throwParty(divisionName, cityName, 10000000);
    }
    corporation = ns.corporation.getCorporation();

    if (ns.corporation.getOfficeSizeUpgradeCost(divisionName, cityName, office.employees) < corporation.funds) {
        ns.corporation.upgradeOfficeSize(divisionName, cityName, office.employees);
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
    return { office, corporation };
}

/** @param {Division} division, @param {NS} ns, @param {CorporationInfo} corporation */
function makeProductsAsNeeded(division, ns, corporation) {
    if (division.makesProducts) {
        const bestCity = division.cities.sort((a, b) => ns.corporation.getOffice(division.name, b).employees - ns.corporation.getOffice(division.name, a).employees)[0];
        division.products.forEach(productName => {
            const product = ns.corporation.getProduct(division.name, productName);
            const isReady = product.developmentProgress === 100;
            const notSelling = Object.keys(product.cityData).every(cn => product.cityData[cn][2] === 0);
            const noDemand = product.dmd < 1;
            if (isReady) {
                
                if (ns.corporation.hasResearched(division.name, "Market-TA.II")) {
                    ns.corporation.setProductMarketTA2(division.name, productName, true);
                } else {
                    ns.corporation.sellProduct(division.name, bestCity, productName, "MAX", "MP", true);
                }
            }
            // OR isReady and price < .1 of highest price
            if (isReady && noDemand) {
                ns.corporation.discontinueProduct(division.name, productName);
            }
        });

        const maxProducts = 3 + (ns.corporation.hasResearched(division.name, "uPgrade: Capacity.I") ? 1 : 0) + (ns.corporation.hasResearched(division.name, "uPgrade: Capacity.II") ? 1 : 0);
        const minProductInvestment = 1000000;
        const maxProductInvestment = 1000000000;
        const targetProductInvestment = Math.min(maxProductInvestment, Math.max(minProductInvestment, Math.min(corporation.funds / 2, (corporation.revenue - corporation.expenses) * 100)));
        if (division.products.length < maxProducts && corporation.funds >= targetProductInvestment * 2 && division.products.every(productName => ns.corporation.getProduct(division.name, productName).developmentProgress === 100)) {
            ns.corporation.makeProduct(division.name, bestCity, crypto.randomUUID(), targetProductInvestment, targetProductInvestment);
        }
    }
}

function expandCity(division, cities, constants, corporation, ns, divisionName, industry) {
    if (division.cities.length < cities.length && constants.officeInitialCost + constants.warehouseInitialCost < corporation.funds) {
        const targetCity = cities.filter(c => !division.cities.includes(c))[0];
        ns.corporation.expandCity(divisionName, targetCity);
        ns.corporation.purchaseWarehouse(divisionName, targetCity);
        ns.corporation.setSmartSupply(divisionName, targetCity, true);
    }
    return ns.corporation.getDivision(divisionName);
}

function upgradeCorporation(constants, corporation, ns) {
    constants.upgradeNames.forEach(upgradeName => {
        corporation = ns.corporation.getCorporation();
        const upgradeLevel = ns.corporation.getUpgradeLevel(upgradeName);

        if (corporation.divisions.length === constants.industryNames.length || upgradeLevel < corporation.divisions.length * 5) {
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
    return corporation;
}

function expandIndustry(constants, corporation, ns, cities) {
    const availableIndustries = constants.industryNames
        .filter(indName => !corporation.divisions.some(d => ns.corporation.getDivision(d).type === indName))
        .map(indName => ({ name: indName, startingCost: ns.corporation.getIndustryData(indName).startingCost, producesMaterials: !!ns.corporation.getIndustryData(indName).producedMaterials }))
        .filter(ind => corporation.divisions.length > 0 || ind.producesMaterials)
        .sort((a, b) => a.startingCost - b.startingCost);
    if (availableIndustries.length > 0 && corporation.divisions.every(divisionName => ns.corporation.getDivision(divisionName).cities.length === cities.length)) {
        const nextIndustry = availableIndustries[0];
        corporation = ns.corporation.getCorporation();
        if (nextIndustry.startingCost < corporation.funds) {
            ns.corporation.expandIndustry(nextIndustry.name, nextIndustry.name);
        }
    }
    return corporation;
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