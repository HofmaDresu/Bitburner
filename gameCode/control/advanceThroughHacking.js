import { startScriptOnHomeIfAble, getConfig, CONFIG_NODE_MULTIPLIERS} from "helpers";
import { sellAll } from "stocks/sellAll";
import { getStockSellValue } from "stocks/helpers";

/** @param {NS} ns */
export default async function advanceThroughHacking(ns) {
    let prevFactionIsDone = false;
    const currentWork = ns.singularity.getCurrentWork();
    const moneySinceInstall = ns.getMoneySources().sinceInstall
    // TODO: Eventually add more money sources like gangs, corporations, bladeburner, etc as we get them
    // NOTE: this is total produced money, not actual money
    const totalMoney =  Math.max(ns.getServerMoneyAvailable("home"), moneySinceInstall.hacking + moneySinceInstall.hacknet + moneySinceInstall.crime + getStockSellValue(ns));

    // 1 (this probably will never be automated unless I cheat)
    // Save until total produced = $$ of 128 GB
    // Get to 128 GB home
    // Join CyberSec
    // Buy max NeuroFlux
    // install augments
    if (ns.getServerMaxRam("home") >= 128) {
        prevFactionIsDone = true;
    }
    prevFactionIsDone = prevFactionIsDone && cyberSec(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && sector12_1(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && niteSec(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && theBlackHand1(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && theBlackHand2(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && chongqing(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && bitRunners1(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && bitRunners2(ns, currentWork, totalMoney);

    const requiredAugs = getConfig(ns)[CONFIG_NODE_MULTIPLIERS]["DaedalusAugsRequirement"];
    if(ns.singularity.getOwnedAugmentations().length < requiredAugs) {
        extraAugments(ns, currentWork, totalMoney, prevFactionIsDone);
        return;
    }
    
    prevFactionIsDone = prevFactionIsDone && daedalus1(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && daedalus2(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && daedalus3(ns, currentWork, totalMoney);
    extraAugments(ns, currentWork, totalMoney, prevFactionIsDone);

}

/** @param {NS} ns */
function extraAugments(ns, currentWork, totalMoney, prevFactionIsDone) {
    prevFactionIsDone = prevFactionIsDone && tianDiHui(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && ishima(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && newTokyo(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && volhaven(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && aevum(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && sector12_2(ns, currentWork, totalMoney);
    if (prevFactionIsDone && currentWork?.type !== "FACTION" && (currentWork?.type !== "CRIME" || currentWork.crimeType !== "Homicide") && !hasAugment(ns, "Graphene Bionic Arms Upgrade")) {
        ns.singularity.commitCrime("Homicide", false);
    }
    prevFactionIsDone = prevFactionIsDone && slumSnakes(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && tetrads(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && theSyndicate(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && speakersForTheDead(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && theDarkArmy(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && megaCorp(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && eCorp(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && kuaiGongInternational(ns, currentWork, totalMoney);
    if (prevFactionIsDone && currentWork?.type !== "FACTION" && (currentWork?.type !== "CRIME" || currentWork.crimeType !== "Kidnap")) {
        ns.singularity.commitCrime("Kidnap", false);
    }
    prevFactionIsDone = prevFactionIsDone && theCovenant1(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && theCovenant2(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && illuminati1(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && illuminati2(ns, currentWork, totalMoney);
}

/** @param {NS} ns */
function illuminati1(ns, currentWork, totalMoney) {
    const faction = "Illuminati";
    const description = null;
    const prepWork = [];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > 1_000_000_000_000}
    ];
    const buyRep = null;
    const whenToStartBuying = [
        () => ns.singularity.getFactionFavor(faction) + ns.singularity.getFactionFavorGain(faction) > ns.getFavorToDonate(),
    ];
    const orderedAugs = [];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function illuminati2(ns, currentWork, totalMoney) {
    const faction = "Illuminati";
    const description = "Round 2";
    const prepWork = [];
    const highestRepCost = ns.singularity.getAugmentationRepReq("QLink")
    const currentRep = ns.singularity.getFactionRep(faction);
    const haveEnoughRep = currentRep >= highestRepCost;
    const getRequiredDonation = () => {return ns.formulas.reputation.donationForRep(highestRepCost - currentRep, ns.getPlayer())};
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return ns.fileExists("Formulas.exe")},
        () => {return totalMoney > getRequiredDonation() || haveEnoughRep}
    ];
    const buyRep = () => {return haveEnoughRep || ns.singularity.donateToFaction(faction, getRequiredDonation())};
    const whenToStartBuying = [];
    const orderedAugs = ["QLink"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function theCovenant1(ns, currentWork, totalMoney) {
    const faction = "The Covenant";
    const description = null;
    const prepWork = [];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > 1_000_000_000_000}
    ];
    const buyRep = null;
    const whenToStartBuying = [
        () => ns.singularity.getFactionFavor(faction) + ns.singularity.getFactionFavorGain(faction) > ns.getFavorToDonate(),
    ];
    const orderedAugs = [];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function theCovenant2(ns, currentWork, totalMoney) {
    const faction = "The Covenant";
    const description = "Round 2";
    const prepWork = [];
    const highestRepCost = ns.singularity.getAugmentationRepReq("SPTN-97 Gene Modification")
    const currentRep = ns.singularity.getFactionRep(faction);
    const haveEnoughRep = currentRep >= highestRepCost;
    const getRequiredDonation = () => {return ns.formulas.reputation.donationForRep(highestRepCost - currentRep, ns.getPlayer())};
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return ns.fileExists("Formulas.exe")},
        () => {return totalMoney > getRequiredDonation() || haveEnoughRep}
    ];
    const buyRep = () => {return haveEnoughRep || ns.singularity.donateToFaction(faction, getRequiredDonation())};
    const whenToStartBuying = [];
    const orderedAugs = ["SPTN-97 Gene Modification", "Graphene Bone Lacings"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function kuaiGongInternational(ns, currentWork, totalMoney) {
    const faction = "KuaiGong International";
    const description = null;
    const prepWork = [
        () => { return workITForCompany(ns, faction, currentWork)}
    ];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", false)},
        () => {return totalMoney > getAugmentPrice(ns, "Photosynthetic Cells")},
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    const orderedAugs = ["Photosynthetic Cells", "HyperSight Corneal Implant", "FocusWire"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function eCorp(ns, currentWork, totalMoney) {
    const faction = "ECorp";
    const description = null;
    const prepWork = [
        () => { return workITForCompany(ns, faction, currentWork)}
    ];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", false)},
        () => {return totalMoney > getAugmentPrice(ns, "Graphene Bionic Spine Upgrade")},
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    const orderedAugs = ["Graphene Bionic Spine Upgrade", "ECorp HVMind Implant", "PC Direct-Neural Interface", "PC Direct-Neural Interface Optimization Submodule"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function megaCorp(ns, currentWork, totalMoney) {
    const faction = "MegaCorp";
    const description = null;
    const prepWork = [
        () => { return workITForCompany(ns, faction, currentWork)}
    ];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", false)},
        () => {return totalMoney > getAugmentPrice(ns, "CordiARC Fusion Reactor")},
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    const orderedAugs = ["CordiARC Fusion Reactor", "Graphene Bionic Legs Upgrade"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function workITForCompany(ns, company, currentWork) {
    ns.singularity.applyToCompany(company, "IT");
    if (currentWork?.type !== "FACTION" && currentWork?.type !== "COMPANY" && currentWork?.companyName !== company && ns.singularity.getCompanyRep(company) < 400_000 ) {
        ns.singularity.workForCompany(company, false);
        return false;
    } else {
        return true;
    }
}

/** @param {NS} ns */
function speakersForTheDead(ns, currentWork, totalMoney) {
    const faction = "Speakers for the Dead";
    const description = null;
    const prepWork = [];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "Unstable Circadian Modulator")},
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    const orderedAugs = ["Unstable Circadian Modulator", "Graphene BrachiBlades Upgrade"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function theDarkArmy(ns, currentWork, totalMoney) {
    const faction = "The Dark Army";
    const description = null;
    const prepWork = [
        () => {return ns.singularity.travelToCity("Chongqing");}
    ];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "Graphene Bionic Arms Upgrade")},
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    const orderedAugs = ["Graphene Bionic Arms Upgrade"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function theSyndicate(ns, currentWork, totalMoney) {
    const faction = "The Syndicate";
    const description = null;
    const prepWork = [];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "The Shadow's Simulacrum")}
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    const orderedAugs = ["The Shadow's Simulacrum", "Bionic Legs", "Bionic Spine", "Combat Rib III", "Augmented Targeting III", "BrachiBlades"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function tetrads(ns, currentWork, totalMoney) {
    const faction = "Tetrads";
    const description = null;
    const prepWork = [
        () => {return ns.singularity.travelToCity("Chongqing");}
    ];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "security", true)},
        () => {return totalMoney > getAugmentPrice(ns, "Bionic Arms")}
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    const orderedAugs = ["Bionic Arms", "Power Recirculation Core", "HemoRecirculator"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function slumSnakes(ns, currentWork, totalMoney) {
    const faction = "Slum Snakes";
    const description = null;
    const prepWork = [];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "security", true)},
        () => {return totalMoney > getAugmentPrice(ns, "SmartSonar Implant")}
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    const orderedAugs = ["SmartSonar Implant", "LuminCloaking-V1 Skin Implant", "LuminCloaking-V2 Skin Implant"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function cyberSec(ns, currentWork, totalMoney) {
    const faction = "CyberSec";
    const description = null;
    const prepWork = [];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "Cranial Signal Processors - Gen I")}
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    const orderedAugs = ["Cranial Signal Processors - Gen I", "Cranial Signal Processors - Gen II", "BitWire", "Synaptic Enhancement Implant", "Neurotrainer I"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function sector12_1(ns, currentWork, totalMoney) {
    const faction = "Sector-12";
    const description = null;
    const prepWork = [
        () => {return ns.singularity.getFactionRep(faction) > 0 || ns.singularity.joinFaction(faction);}
    ];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "CashRoot Starter Kit")}
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    const orderedAugs = ["CashRoot Starter Kit"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function niteSec(ns, currentWork, totalMoney) {
    const faction = "NiteSec";
    const description = null;
    const prepWork = [];
    const orderedAugs = ["Neural-Retention Enhancement", "CRTX42-AA Gene Modification", "Artificial Synaptic Potentiation", "Neurotrainer II"];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return haveEnoughMoneyForAllAugments(ns, totalMoney, orderedAugs)}
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function theBlackHand1(ns, currentWork, totalMoney) {
    const faction = "The Black Hand";
    const description = null;
    const prepWork = [];
    const orderedAugs = ["The Black Hand", "Cranial Signal Processors - Gen III", "DataJack", "Embedded Netburner Module"];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return haveEnoughMoneyForAllAugments(ns, totalMoney, orderedAugs)}
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function theBlackHand2(ns, currentWork, totalMoney) {
    const faction = "The Black Hand";
    const description = "Round 2";
    const prepWork = [];
    const orderedAugs = ["Neuralstimulator", "Embedded Netburner Module Core Implant", "Enhanced Myelin Sheathing", "Cranial Signal Processors - Gen IV"];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return haveEnoughMoneyForAllAugments(ns, totalMoney, orderedAugs)}
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function chongqing(ns, currentWork, totalMoney) {
    const faction = "Chongqing";
    const description = null;
    const prepWork = [
        () => {return ns.singularity.travelToCity("Chongqing");},
        () => {return ns.singularity.getFactionRep(faction) > 0 || ns.singularity.joinFaction(faction);}
    ];
    const orderedAugs = ["Neuregen Gene Modification", "Speech Processor Implant", "Nuoptimal Nootropic Injector Implant"];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return haveEnoughMoneyForAllAugments(ns, totalMoney, orderedAugs)}
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function bitRunners1(ns, currentWork, totalMoney) {
    const faction = "BitRunners";
    const description = null;
    const prepWork = [];
    const orderedAugs = ["Artificial Bio-neural Network Implant", "Cranial Signal Processors - Gen V", "Neural Accelerator"];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return haveEnoughMoneyForAllAugments(ns, totalMoney, orderedAugs)}
    ];
    const buyRep = null;
    const whenToStartBuying = [
        () => ns.singularity.getFactionFavor(faction) + ns.singularity.getFactionFavorGain(faction) > ns.getFavorToDonate(),
    ];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function bitRunners2(ns, currentWork, totalMoney) {
    const faction = "BitRunners";
    const description = "Round 2";
    const prepWork = [];
    const highestRepCost = ns.singularity.getAugmentationRepReq("Embedded Netburner Module Core V2 Upgrade")
    const currentRep = ns.singularity.getFactionRep(faction);
    const haveEnoughRep = currentRep >= highestRepCost;
    const getRequiredDonation = () => {return ns.formulas.reputation.donationForRep(highestRepCost - currentRep, ns.getPlayer())};
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return ns.fileExists("Formulas.exe")},
        () => {return totalMoney > getRequiredDonation() || haveEnoughRep}
    ];
    const buyRep = () => {return haveEnoughRep || ns.singularity.donateToFaction(faction, getRequiredDonation())};
    const whenToStartBuying = [];
    const orderedAugs = ["Embedded Netburner Module Core V2 Upgrade", "BitRunners Neurolink"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function tianDiHui(ns, currentWork, totalMoney) {
            const faction = "Tian Di Hui";
    const description = null;
    const prepWork = [
        () => {return ns.singularity.travelToCity("Ishima");}
    ];
    const orderedAugs = ["Neuroreceptor Management Implant", "Nanofiber Weave", "Social Negotiation Assistant (S.N.A)", "ADR-V1 Pheromone Gene", "Speech Enhancement", "Wired Reflexes"];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return haveEnoughMoneyForAllAugments(ns, totalMoney, orderedAugs)}
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function ishima(ns, currentWork, totalMoney) {
    const faction = "Ishima";
    const description = null;
    const prepWork = [
        () => {return ns.singularity.travelToCity("Ishima");},
        () => {return ns.singularity.getFactionRep(faction) > 0 || ns.singularity.joinFaction(faction);}
    ];
    const orderedAugs = ["INFRARET Enhancement", "Combat Rib I", "Augmented Targeting I"];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return haveEnoughMoneyForAllAugments(ns, totalMoney, orderedAugs)}
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function newTokyo(ns, currentWork, totalMoney) {
    const faction = "New Tokyo";
    const description = null;
    const prepWork = [
        () => {return ns.singularity.travelToCity("New Tokyo");},
        () => {return ns.singularity.getFactionRep(faction) > 0 || ns.singularity.joinFaction(faction);}
    ];
    const orderedAugs = ["NutriGen Implant"];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return haveEnoughMoneyForAllAugments(ns, totalMoney, orderedAugs)}
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function volhaven(ns, currentWork, totalMoney) {
    const faction = "Volhaven";
    const description = null;
    const prepWork = [
        () => {return ns.singularity.travelToCity("Volhaven");},
        () => {return ns.singularity.getFactionRep(faction) > 0 || ns.singularity.joinFaction(faction);}
    ];
    const orderedAugs = ["Combat Rib II", "DermaForce Particle Barrier"];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return haveEnoughMoneyForAllAugments(ns, totalMoney, orderedAugs)}
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function aevum(ns, currentWork, totalMoney) {
    const faction = "Aevum";
    const description = null;
    const prepWork = [
        () => {return ns.singularity.travelToCity("Aevum");},
        () => {return ns.singularity.getFactionRep(faction) > 0 || ns.singularity.joinFaction(faction);}
    ];
    const orderedAugs = ["PCMatrix"];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return haveEnoughMoneyForAllAugments(ns, totalMoney, orderedAugs)}
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function sector12_2(ns, currentWork, totalMoney) {
    const faction = "Sector-12";
    const description = null;
    const prepWork = [
        () => {return ns.singularity.getFactionRep(faction) > 0 || ns.singularity.joinFaction(faction);}
    ];
    const orderedAugs = ["Augmented Targeting II"];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return haveEnoughMoneyForAllAugments(ns, totalMoney, orderedAugs)}
    ];
    const buyRep = null;
    const whenToStartBuying = [];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function daedalus1(ns, currentWork, totalMoney) {
    const faction = "Daedalus";
    const description = null;
    const prepWork = [];
    const orderedAugs = ["Synfibril Muscle"];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return haveEnoughMoneyForAllAugments(ns, totalMoney, orderedAugs)}
    ];
    const buyRep = null;
    const whenToStartBuying = [
        () => ns.singularity.getFactionFavor(faction) + ns.singularity.getFactionFavorGain(faction) > ns.getFavorToDonate(),
    ];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function daedalus2(ns, currentWork, totalMoney) {
    const faction = "Daedalus";
    const description = "Round 2";
    const prepWork = [];
    const highestRepCost = ns.singularity.getAugmentationRepReq("The Red Pill")
    const currentRep = ns.singularity.getFactionRep(faction);
    const haveEnoughRep = currentRep >= highestRepCost;
    const getRequiredDonation = () => {return ns.formulas.reputation.donationForRep(highestRepCost - currentRep, ns.getPlayer())};
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return ns.fileExists("Formulas.exe")},
        () => {return totalMoney > getRequiredDonation() || haveEnoughRep}
    ];
    const buyRep = () => {return haveEnoughRep || ns.singularity.donateToFaction(faction, getRequiredDonation())};
    const whenToStartBuying = [];
    const orderedAugs = ["Embedded Netburner Module Direct Memory Access Upgrade", "Embedded Netburner Module Core V3 Upgrade", "Embedded Netburner Module Analyze Engine","The Red Pill"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function daedalus3(ns, currentWork, totalMoney) {
    const faction = "Daedalus";
    const description = "Round 3";
    const prepWork = [];
    const highestRepCost = ns.singularity.getAugmentationRepReq("NEMEAN Subdermal Weave")
    const currentRep = ns.singularity.getFactionRep(faction);
    const haveEnoughRep = currentRep >= highestRepCost;
    const getRequiredDonation = () => {return ns.formulas.reputation.donationForRep(highestRepCost - currentRep, ns.getPlayer())};
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return ns.fileExists("Formulas.exe")},
        () => {return totalMoney > getRequiredDonation() || haveEnoughRep}
    ];
    const buyRep = () => {return haveEnoughRep || ns.singularity.donateToFaction(faction, getRequiredDonation())};
    const whenToStartBuying = [];
    const orderedAugs = ["NEMEAN Subdermal Weave", "Synthetic Heart"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
/** @param {Array<Function>} whenToWindDown */
/** @param {Array<Function>} whenToStartBuying */
/** @param {Function} buyRepFunction */
function getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork) {
    if(orderedAugs.reduce((owned, aug) => owned && hasAugment(ns, aug), true)) return true;
    ns.print("Starting faction " + faction);
    if(description) ns.print(description);
    if(!prepWork.reduce((isSuccess, fn) => isSuccess && fn(), true)) return false;
    if(!whenToWindDown.reduce((isSuccess, fn) => isSuccess && fn(), true)) return false;
    ns.print("\t Ready to wind down");
    if(buyRep) {
        startScriptOnHomeIfAble(ns, "windDown.js");
        if(!buyRep()) return false;
        ns.print("\t Have needed rep");
    } else {
        startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
    }
    if(!whenToStartBuying.reduce((isSuccess, fn) => isSuccess && fn(), true)) return false;
    ns.print("\t Ready to start buying");
    sellAll(ns);
    if(!orderedAugs.reduce((isSuccess, aug) => isSuccess && getAugmentIfAble(ns, faction, aug), true)) return false;
    ns.print("\t Ready to max out neuro flux");
    maxOutNeuroFlux(ns, faction);
    installAugments(ns);
    return true;
}

/** @param {NS} ns */
function getAugmentIfAble(ns, faction, augment) {
    return hasAugment(ns, augment, true) || ns.singularity.purchaseAugmentation(faction, augment);
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
function haveEnoughMoneyForAllAugments(ns, totalMoney, augmentList) {
    let multiplier = 1;
    let totalCost = 0;
    for (const augment of augmentList) {
        if (!hasAugment(ns, augment, true)) {
            totalCost = totalCost + (multiplier * getAugmentPrice(ns, augment));
            multiplier += .9;
        }
    }
    // Buffer
    totalCost = totalCost * 1.2;
    ns.print(`Required money for augments: \t$${ns.formatNumber(totalCost, 2)}`)
    ns.print(`Total money: \t\t\t$${ns.formatNumber(totalMoney, 2)}`)
    return totalCost < totalMoney;
}


/** @param {NS} ns */
function getAugmentPrice(ns, augment) {
    return ns.singularity.getAugmentationPrice(augment)
}

/** @param {NS} ns */
export function hasAugment(ns, augment, includePurchased = false) {
    const installedAugments = ns.singularity.getOwnedAugmentations(includePurchased);
    return installedAugments.indexOf(augment) !== -1
}