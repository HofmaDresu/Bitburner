/** @param {NS} ns */
export default async function advanceThroughHacking(ns) {
    const currentWork = ns.singularity.getCurrentWork();
    const moneySinceInstall = ns.getMoneySources().sinceInstall
    // TODO: Eventually add more money sources like gangs, corporations, bladeburner, etc as we get them
    const totalMoney = moneySinceInstall.hacking + moneySinceInstall.hacknet + moneySinceInstall.crime + Math.max(0, moneySinceInstall.stock);

    // 1
    // Save until total produced = $$ of 128 GB
    // Get to 128 GB home
    // Join CyberSec
    // Buy 7 NeuroFlux
    // install augments
    if (ns.getServerMaxRam("home") >= 128 && !hasAugment(ns, "Synaptic Enhancement Implant")) {
        const faction = "CyberSec";
        ns.print("Starting faction " + faction);
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            if(totalMoney < getAugmentPrice(ns, "Cranial Signal Processors - Gen II")) return;
            if(!(hasAugment(ns, "Cranial Signal Processors - Gen I", true) || ns.singularity.purchaseAugmentation(faction, "Cranial Signal Processors - Gen I"))) return;
            if(!(hasAugment(ns, "Cranial Signal Processors - Gen II", true) || ns.singularity.purchaseAugmentation(faction, "Cranial Signal Processors - Gen II"))) return;
            if(!(hasAugment(ns, "BitWire", true) || ns.singularity.purchaseAugmentation(faction, "BitWire"))) return;
            if(!(hasAugment(ns, "Synaptic Enhancement Implant", true) || ns.singularity.purchaseAugmentation(faction, "Synaptic Enhancement Implant"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }
    if(hasAugment(ns, "Cranial Signal Processors - Gen II") && !hasAugment(ns, "CashRoot Starter Kit")) {
        const faction = "Sector 12";
        ns.print("Starting faction " + faction);
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            if(totalMoney < getAugmentPrice(ns, "CashRoot Starter Kit")) return;
            if(!(hasAugment(ns, "CashRoot Starter Kit", true) || ns.singularity.purchaseAugmentation(faction, "CashRoot Starter Kit"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }
    if(hasAugment(ns, "CashRoot Starter Kit") && !hasAugment(ns, "Neurotrainer II")) {
        const faction = "NiteSec";
        ns.print("Starting faction " + faction);
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            if(totalMoney < getAugmentPrice(ns, "Neural-Retention Enhancement") + 1.9 * getAugmentPrice(ns, "CRTX42-AA Gene Modification")) return;
            if(!(hasAugment(ns, "Neural-Retention Enhancement", true) || ns.singularity.purchaseAugmentation(faction, "Neural-Retention Enhancement"))) return;
            if(!(hasAugment(ns, "CRTX42-AA Gene Modification", true) || ns.singularity.purchaseAugmentation(faction, "CRTX42-AA Gene Modification"))) return;
            if(!(hasAugment(ns, "Artificial Synaptic Potentiation", true) || ns.singularity.purchaseAugmentation(faction, "Artificial Synaptic Potentiation"))) return;
            if(!(hasAugment(ns, "Neurotrainer II", true) || ns.singularity.purchaseAugmentation(faction, "Neurotrainer II"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }
    if(hasAugment(ns, "Neurotrainer II") && !hasAugment(ns, "Embedded Netburner Module")) {
        const faction = "The Black Hand";
        ns.print("Starting faction " + faction + " 1");
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            if(totalMoney < getAugmentPrice(ns, "The Black Hand")) return;
            if(!(hasAugment(ns, "The Black Hand", true) || ns.singularity.purchaseAugmentation(faction, "The Black Hand"))) return;
            if(!(hasAugment(ns, "Cranial Signal Processors - Gen III", true) || ns.singularity.purchaseAugmentation(faction, "Cranial Signal Processors - Gen III"))) return;
            if(!(hasAugment(ns, "DataJack", true) || ns.singularity.purchaseAugmentation(faction, "DataJack"))) return;
            if(!(hasAugment(ns, "Embedded Netburner Module", true) || ns.singularity.purchaseAugmentation(faction, "Embedded Netburner Module"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }
    if(hasAugment(ns, "Embedded Netburner Module") && !hasAugment(ns, "Cranial Signal Processors - Gen IV")) {
        const faction = "The Black Hand";
        ns.print("Starting faction " + faction + " 2");
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            if(totalMoney < getAugmentPrice(ns, "Neuralstimulator")) return;
            if(!(hasAugment(ns, "Neuralstimulator", true) || ns.singularity.purchaseAugmentation(faction, "Neuralstimulator"))) return;
            if(!(hasAugment(ns, "Embedded Netburner Module Core Implant", true) || ns.singularity.purchaseAugmentation(faction, "Embedded Netburner Module Core Implant"))) return;
            if(!(hasAugment(ns, "Enhanced Myelin Sheathing", true) || ns.singularity.purchaseAugmentation(faction, "Enhanced Myelin Sheathing"))) return;
            if(!(hasAugment(ns, "Cranial Signal Processors - Gen IV", true) || ns.singularity.purchaseAugmentation(faction, "Cranial Signal Processors - Gen IV"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }
    if(hasAugment(ns, "Cranial Signal Processors - Gen IV") && !hasAugment(ns, "Neural Accelerator")) {
        const faction = "BitRunners";
        ns.print("Starting faction " + faction + " 1");
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            if(totalMoney < getAugmentPrice(ns, "Artificial Bio-neural Network Implant")) return;
            if(ns.singularity.getFactionFavor(faction) + ns.singularity.getFactionFavorGain(faction) < ns.getFavorToDonate()) return;
            if(!(hasAugment(ns, "Artificial Bio-neural Network Implant", true) || ns.singularity.purchaseAugmentation(faction, "Artificial Bio-neural Network Implant"))) return;
            if(!(hasAugment(ns, "Cranial Signal Processors - Gen V", true) || ns.singularity.purchaseAugmentation(faction, "Cranial Signal Processors - Gen V"))) return;
            if(!(hasAugment(ns, "Neural Accelerator", true) || ns.singularity.purchaseAugmentation(faction, "Neural Accelerator"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }
    if(hasAugment(ns, "Neural Accelerator") && !hasAugment(ns, "BitRunners Neurolink")) {
        const faction = "BitRunners";
        ns.print("Starting faction " + faction + " 2");
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            const highestRepCost = ns.singularity.getAugmentationRepReq("Embedded Netburner Module Core V2 Upgrade")
            if (!ns.fileExists("Formulas.exe")) return;
            const requiredDonation = ns.formulas.reputation.donationForRep(highestRepCost - ns.singularity.getFactionRep(faction), ns.getPlayer())
            if(!(totalMoney >= requiredDonation && ns.singularity.donateToFaction(faction, requiredDonation))) return;
            if(!(hasAugment(ns, "Embedded Netburner Module Core V2 Upgrade", true) || ns.singularity.purchaseAugmentation(faction, "Embedded Netburner Module Core V2 Upgrade"))) return;
            if(!(hasAugment(ns, "BitRunners Neurolink", true) || ns.singularity.purchaseAugmentation(faction, "BitRunners Neurolink"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }

}

/** @param {NS} ns */
function maxOutNeuroFlux(ns, faction) {
    let success = false;
    do {
        success = ns.singularity.purchaseAugmentation(faction, "NeuroFlux Governor");
    } while(success)
}

/** @param {NS} ns */
function installAugments(ns) {
    ns.singularity.installAugmentations("startup.js");
}

/** @param {NS} ns */
function getAugmentPrice(ns, augment) {
    return ns.singularity.getAugmentationPrice(augment)
}

/** @param {NS} ns */
function hasAugment(ns, augment, includePurchased = false) {
    const installedAugments = ns.singularity.getOwnedAugmentations(includePurchased);
    return installedAugments.indexOf(augment) !== -1
}