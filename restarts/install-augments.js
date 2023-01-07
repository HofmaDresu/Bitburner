import {portfolioFileName} from "/stocks/helpers.js"

/** @param {NS} ns */
export async function main(ns) {
    sellStocks(ns);
    upgradeHomeServer(ns);
    purchaseNueroFluxGovernor(ns);
    ns.singularity.installAugmentations("startup.js")
}

function sellStocks(ns) {    
	var portfolioData = JSON.parse(ns.read(portfolioFileName));
	Object.keys(portfolioData).forEach(stockSymbol => {
		var ownedData = portfolioData[stockSymbol];
		if (ownedData?.amount) {
            ns.stock.sellStock(stockSymbol, ownedData.amount);
        }
	});
	ns.write(portfolioFileName,"{}", "w");
}

function upgradeHomeServer(ns) {
    let upgradeHomeCoresCost = ns.singularity.getUpgradeHomeCoresCost();
    let upgradeHomeRamCost = ns.singularity.getUpgradeHomeRamCost();
    let availableMonies = ns.getServerMoneyAvailable("home");

    while (upgradeHomeCoresCost && upgradeHomeRamCost && (availableMonies > upgradeHomeCoresCost || availableMonies > upgradeHomeRamCost)) {
        if (upgradeHomeCoresCost > 0 && availableMonies > upgradeHomeCoresCost) {
            ns.singularity.upgradeHomeCores();
        }
        if (upgradeHomeRamCost > 0 && availableMonies > upgradeHomeRamCost) {
            ns.singularity.upgradeHomeRam();
        }
        upgradeHomeCoresCost = ns.singularity.getUpgradeHomeCoresCost();
        upgradeHomeRamCost = ns.singularity.getUpgradeHomeRamCost();
        availableMonies = ns.getServerMoneyAvailable("home");
    }
}

function purchaseNueroFluxGovernor(ns) {    
	const player = ns.getPlayer();
    const factionsWithReputation = player.factions.map(f => ({faction: f, reputation: ns.singularity.getFactionRep(f)})).sort((a, b) => b.reputation - a.reputation);
    if (factionsWithReputation.length === 0) return;
    const mostReputedFaction = factionsWithReputation[0];
    let rep = ns.singularity.getAugmentationRepReq("NeuroFlux Governor");
    let cost = ns.singularity.getAugmentationPrice("NeuroFlux Governor");
    let availableMonies = ns.getServerMoneyAvailable("home");

    while (availableMonies >= cost && mostReputedFaction.reputation >= rep) {
        ns.singularity.purchaseAugmentation(mostReputedFaction.faction, "NeuroFlux Governor");
        rep = ns.singularity.getAugmentationRepReq("NeuroFlux Governor");
        cost = ns.singularity.getAugmentationPrice("NeuroFlux Governor");
        availableMonies = ns.getServerMoneyAvailable("home");
    }
}