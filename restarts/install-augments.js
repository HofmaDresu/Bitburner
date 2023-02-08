import {stockToServers} from "/stocks/helpers.js"

/** @param {NS} ns */
export async function main(ns) {
    sellStocks(ns);
    upgradeHomeServer(ns);
    await purchaseNueroFluxGovernor(ns);
    ns.singularity.installAugmentations("/automation/script-starter.js")
}

function sellStocks(ns) {
    if (!ns.stock.hasTIXAPIAccess()) return;
	Object.keys(stockToServers).forEach(stockSymbol => {
		const [longShares, _longPx, shortShares, _shortPx] = ns.stock.getPosition(stockSymbol);
		if (longShares) {
            ns.stock.sellStock(stockSymbol, longShares);
        }
        if (shortShares) {
            ns.stock.sellShort(stockSymbol, shortShares);
        }
	});
}

function upgradeHomeServer(ns) {
    let upgradeHomeCoresCost = ns.singularity.getUpgradeHomeCoresCost();
    let upgradeHomeRamCost = ns.singularity.getUpgradeHomeRamCost();
    let availableMonies = ns.getServerMoneyAvailable("home");

    // TODO: get working for fully-upgraded home server
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

/** @param {NS} ns */
async function purchaseNueroFluxGovernor(ns) {    
	const player = ns.getPlayer();
    const factionsWithReputation = player.factions.map(f => ({faction: f, reputation: ns.singularity.getFactionRep(f)})).sort((a, b) => b.reputation - a.reputation);
    if (factionsWithReputation.length === 0) return;
    const factionsWithNeuroFluxGoverner = factionsWithReputation.filter(f => ns.singularity.getAugmentationsFromFaction(f.faction).some(a => a === "NeuroFlux Governor"));
    if (factionsWithNeuroFluxGoverner.length === 0) return;  
    const mostReputedFaction = factionsWithNeuroFluxGoverner[0];
    let rep = ns.singularity.getAugmentationRepReq("NeuroFlux Governor");
    let cost = ns.singularity.getAugmentationPrice("NeuroFlux Governor");
    let availableMonies = ns.getServerMoneyAvailable("home");

    while (availableMonies >= cost && mostReputedFaction.reputation >= rep) {
        ns.singularity.purchaseAugmentation(mostReputedFaction.faction, "NeuroFlux Governor");
        rep = ns.singularity.getAugmentationRepReq("NeuroFlux Governor");
        cost = ns.singularity.getAugmentationPrice("NeuroFlux Governor");
        availableMonies = ns.getServerMoneyAvailable("home");
        await ns.sleep(10);
    }
}