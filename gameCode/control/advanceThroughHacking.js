import { startScriptOnHomeIfAble, getConfig, CONFIG_NODE_MULTIPLIERS} from "helpers";

/** @param {NS} ns */
export default async function advanceThroughHacking(ns) {
    let prevFactionIsDone = false;
    const currentWork = ns.singularity.getCurrentWork();
    const moneySinceInstall = ns.getMoneySources().sinceInstall
    // TODO: Eventually add more money sources like gangs, corporations, bladeburner, etc as we get them
    const totalMoney = moneySinceInstall.hacking + moneySinceInstall.hacknet + moneySinceInstall.crime + Math.max(0, moneySinceInstall.stock);

    // 1 (this probably will never be automated unless I cheat)
    // Save until total produced = $$ of 128 GB
    // Get to 128 GB home
    // Join CyberSec
    // Buy max NeuroFlux
    // install augments
    if (ns.getServerMaxRam("home") >= 128) {
        prevFactionIsDone = true;
        // const faction = "CyberSec";
        // ns.print("Starting faction " + faction);
        // if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
        //     if(totalMoney < getAugmentPrice(ns, "Neurotrainer I")) return;
        //     startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
        //     if(!(getAugmentIfAble(ns, faction, "Cranial Signal Processors - Gen I"))) return;
        //     if(!(getAugmentIfAble(ns, faction, "Cranial Signal Processors - Gen II"))) return;
        //     if(!(getAugmentIfAble(ns, faction, "BitWire"))) return;
        //     if(!(getAugmentIfAble(ns, faction, "Synaptic Enhancement Implant"))) return;
        //     if(!(getAugmentIfAble(ns, faction, "Neurotrainer I"))) return;
        //     maxOutNeuroFlux(ns, faction);
        //     installAugments(ns);
        // }
    }
    prevFactionIsDone = prevFactionIsDone && cyberSec(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && sector12_1(ns, currentWork, totalMoney);
    if(hasAugment(ns, "Cranial Signal Processors - Gen II") && !hasAugment(ns, "CashRoot Starter Kit")) {
        const faction = "Sector-12";
        ns.print("Starting faction " + faction);
        ns.singularity.joinFaction(faction);
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            if(totalMoney < getAugmentPrice(ns, "CashRoot Starter Kit")) return;
            startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
            if(!(getAugmentIfAble(ns, faction, "CashRoot Starter Kit"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }
    prevFactionIsDone = prevFactionIsDone && niteSec(ns, currentWork, totalMoney);
    // if(hasAugment(ns, "CashRoot Starter Kit") && !hasAugment(ns, "Neurotrainer II")) {
    //     const faction = "NiteSec";
    //     ns.print("Starting faction " + faction);
    //     if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
    //         if(totalMoney < getAugmentPrice(ns, "Neural-Retention Enhancement") + 1.9 * getAugmentPrice(ns, "CRTX42-AA Gene Modification")) return;
    //         startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
    //         if(!(getAugmentIfAble(ns, faction, "Neural-Retention Enhancement"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "CRTX42-AA Gene Modification"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "Artificial Synaptic Potentiation"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "Neurotrainer II"))) return;
    //         maxOutNeuroFlux(ns, faction);
    //         installAugments(ns);
    //     }
    // }
    prevFactionIsDone = prevFactionIsDone && theBlackHand1(ns, currentWork, totalMoney);
    // if(hasAugment(ns, "Neurotrainer II") && !hasAugment(ns, "Embedded Netburner Module")) {
    //     const faction = "The Black Hand";
    //     ns.print("Starting faction " + faction + " 1");
    //     if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
    //         if(totalMoney < getAugmentPrice(ns, "The Black Hand")) return;
    //         startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
    //         if(!(getAugmentIfAble(ns, faction, "The Black Hand"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "Cranial Signal Processors - Gen III"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "DataJack"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "Embedded Netburner Module"))) return;
    //         maxOutNeuroFlux(ns, faction);
    //         installAugments(ns);
    //     }
    // }
    prevFactionIsDone = prevFactionIsDone && theBlackHand2(ns, currentWork, totalMoney);
    // if(hasAugment(ns, "Embedded Netburner Module") && !hasAugment(ns, "Cranial Signal Processors - Gen IV")) {
    //     const faction = "The Black Hand";
    //     ns.print("Starting faction " + faction + " 2");
    //     if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
    //         if(totalMoney < getAugmentPrice(ns, "Neuralstimulator")) return;
    //         startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
    //         if(!(getAugmentIfAble(ns, faction, "Neuralstimulator"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "Embedded Netburner Module Core Implant"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "Enhanced Myelin Sheathing"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "Cranial Signal Processors - Gen IV"))) return;
    //         maxOutNeuroFlux(ns, faction);
    //         installAugments(ns);
    //     }
    // }    
    prevFactionIsDone = prevFactionIsDone && chongqing(ns, currentWork, totalMoney);
    // if(hasAugment(ns, "Cranial Signal Processors - Gen IV") && !hasAugment(ns, "Nuoptimal Nootropic Injector Implant")) {
    //     const faction = "Chongqing";
    //     ns.print("Starting faction " + faction);
    //     ns.singularity.travelToCity("Chongqing");
    //     ns.singularity.joinFaction(faction);
    //     if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
    //         if(totalMoney < getAugmentPrice(ns, "Neuregen Gene Modification")) return;
    //         startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
    //         if(!(getAugmentIfAble(ns, faction, "Neuregen Gene Modification"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "Speech Processor Implant"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "Nuoptimal Nootropic Injector Implant"))) return;
    //         maxOutNeuroFlux(ns, faction);
    //         installAugments(ns);
    //     }
    // }    
    prevFactionIsDone = prevFactionIsDone && bitRunners1(ns, currentWork, totalMoney);
    // if(hasAugment(ns, "Nuoptimal Nootropic Injector Implant") && !hasAugment(ns, "Neural Accelerator")) {
    //     const faction = "BitRunners";
    //     ns.print("Starting faction " + faction + " 1");
    //     if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
    //         if(totalMoney < getAugmentPrice(ns, "Artificial Bio-neural Network Implant")) return;
    //         startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
    //         if(ns.singularity.getFactionFavor(faction) + ns.singularity.getFactionFavorGain(faction) < ns.getFavorToDonate()) return;
    //         if(!(getAugmentIfAble(ns, faction, "Artificial Bio-neural Network Implant"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "Cranial Signal Processors - Gen V"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "Neural Accelerator"))) return;
    //         maxOutNeuroFlux(ns, faction);
    //         installAugments(ns);
    //     }
    // }
    prevFactionIsDone = prevFactionIsDone && bitRunners2(ns, currentWork, totalMoney);
    // if(hasAugment(ns, "Neural Accelerator") && !hasAugment(ns, "BitRunners Neurolink")) {
    //     const faction = "BitRunners";
    //     ns.print("Starting faction " + faction + " 2");
    //     if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
    //         const highestRepCost = ns.singularity.getAugmentationRepReq("Embedded Netburner Module Core V2 Upgrade")
    //         const currentRep = ns.singularity.getFactionRep(faction);
    //         const haveEnoughRep = currentRep >= highestRepCost;
    //         if (!ns.fileExists("Formulas.exe")) return;
    //         const requiredDonation = ns.formulas.reputation.donationForRep(highestRepCost - currentRep, ns.getPlayer())
    //         if(totalMoney < requiredDonation && !haveEnoughRep) return;
    //         // Not sharing memory because we're purchasing rep OR we've got enough
    //         startScriptOnHomeIfAble(ns, "windDown.js");
    //         if(!(haveEnoughRep || ns.singularity.donateToFaction(faction, requiredDonation))) return;
    //         if(!(getAugmentIfAble(ns, faction, "Embedded Netburner Module Core V2 Upgrade"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "BitRunners Neurolink"))) return;
    //         maxOutNeuroFlux(ns, faction);
    //         installAugments(ns);
    //     }
    // }

    const requiredAugs = getConfig(ns)[CONFIG_NODE_MULTIPLIERS]["DaedalusAugsRequirement"];
    if(ns.singularity.getOwnedAugmentations().length < requiredAugs) {
        extraAugments(ns, currentWork, totalMoney, prevFactionIsDone);
        //if(hasAugment(ns, "BitRunners Neurolink") && !hasAugment(ns, "Wired Reflexes")) {
        //    const faction = "Tian Di Hui";
        //    ns.print("Starting faction " + faction);
        //    ns.singularity.travelToCity("Ishima");
        //    if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
        //        if(totalMoney < getAugmentPrice(ns, "Neuregen Gene Modification")) return;
        //        startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
        //        if(!(getAugmentIfAble(ns, faction, "Neuroreceptor Management Implant"))) return;
        //        if(!(getAugmentIfAble(ns, faction, "Nanofiber Weave"))) return;
        //        if(!(getAugmentIfAble(ns, faction, "Social Negotiation Assistant (S.N.A)"))) return;
        //        if(!(getAugmentIfAble(ns, faction, "ADR-V1 Pheromone Gene"))) return;
        //        if(!(getAugmentIfAble(ns, faction, "Speech Enhancement"))) return;
        //        if(!(getAugmentIfAble(ns, faction, "Wired Reflexes"))) return;
        //        maxOutNeuroFlux(ns, faction);
        //        installAugments(ns);
        //    }
        //}
        //if(hasAugment(ns, "Wired Reflexes") && !hasAugment(ns, "Augmented Targeting I")) {
        //    const faction = "Ishima";
        //    ns.print("Starting faction " + faction);
        //    ns.singularity.travelToCity("Ishima");
        //    ns.singularity.joinFaction(faction);
        //    if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
        //        if(totalMoney < getAugmentPrice(ns, "Neuregen Gene Modification")) return;
        //        startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
        //        if(!(getAugmentIfAble(ns, faction, "Speech Processor Implant"))) return;
        //        if(!(getAugmentIfAble(ns, faction, "INFRARET Enhancement"))) return;
        //        if(!(getAugmentIfAble(ns, faction, "Combat Rib I"))) return;
        //        if(!(getAugmentIfAble(ns, faction, "Augmented Targeting I"))) return;
        //        maxOutNeuroFlux(ns, faction);
        //        installAugments(ns);
        //    }
        //}
        //if(hasAugment(ns, "Augmented Targeting I") && !hasAugment(ns, "NutriGen Implant")) {
        //    const faction = "New Tokyo";
        //    ns.print("Starting faction " + faction);
        //    ns.singularity.travelToCity("New Tokyo");
        //    if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
        //        if(totalMoney < getAugmentPrice(ns, "Neuregen Gene Modification")) return;
        //        startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
        //        if(!(getAugmentIfAble(ns, faction, "NutriGen Implant"))) return;
        //        maxOutNeuroFlux(ns, faction);
        //        installAugments(ns);
        //    }
        //}
        //if(hasAugment(ns, "NutriGen Implant") && !hasAugment(ns, "DermaForce Particle Barrier")) {
        //    const faction = "Volhaven";
        //    ns.print("Starting faction " + faction);
        //    ns.singularity.travelToCity("Volhaven");
        //    if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
        //        if(totalMoney < getAugmentPrice(ns, "Neuregen Gene Modification")) return;
        //        startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
        //        if(!(getAugmentIfAble(ns, faction, "Combat Rib II"))) return;
        //        if(!(getAugmentIfAble(ns, faction, "DermaForce Particle Barrier"))) return;
        //        maxOutNeuroFlux(ns, faction);
        //        installAugments(ns);
        //    }
        //}

        // Travel to Aevum

        return;
    }

    
    // if(hasAugment(ns, "BitRunners Neurolink") && !hasAugment(ns, "Synfibril Muscle")) {
    //     const faction = "Daedalus";
    //     ns.print("Starting faction " + faction + " 1");
    //     if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
    //         if(totalMoney < getAugmentPrice(ns, "Synfibril Muscle")) return;
    //         startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
    //         if(ns.singularity.getFactionFavor(faction) + ns.singularity.getFactionFavorGain(faction) < ns.getFavorToDonate()) return;
    //         if(!(getAugmentIfAble(ns, faction, "Synfibril Muscle"))) return;
    //         maxOutNeuroFlux(ns, faction);
    //         installAugments(ns);
    //     }
    // }
    // if(hasAugment(ns, "Synfibril Muscle") && !hasAugment(ns, "The Red Pill")) {
    //     const faction = "Daedalus";
    //     ns.print("Starting faction " + faction + " 2");
    //     if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
    //         const highestRepCost = ns.singularity.getAugmentationRepReq("The Red Pill")
    //         const currentRep = ns.singularity.getFactionRep(faction);
    //         const haveEnoughRep = currentRep >= highestRepCost;
    //         if (!ns.fileExists("Formulas.exe")) return;
    //         const requiredDonation = ns.formulas.reputation.donationForRep(highestRepCost - currentRep, ns.getPlayer())
    //         if(totalMoney < requiredDonation && !haveEnoughRep) return;
    //         // Not sharing memory because we're purchasing rep OR we've got enough
    //         startScriptOnHomeIfAble(ns, "windDown.js");
    //         if(!(haveEnoughRep || ns.singularity.donateToFaction(faction, requiredDonation))) return;
    //         if(!(getAugmentIfAble(ns, faction, "Embedded Netburner Module Direct Memory Access Upgrade"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "Embedded Netburner Module Core V3 Upgrade"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "Embedded Netburner Module Analyze Engine"))) return;
    //         if(!(getAugmentIfAble(ns, faction, "The Red Pill"))) return;
    //         maxOutNeuroFlux(ns, faction);
    //         installAugments(ns);
    //     }
    // }
    
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
    if (currentWork?.type !== "FACTION") {
        ns.singularity.commitCrime("Homicide", false);
    }
    prevFactionIsDone = prevFactionIsDone && slumSnakes(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && tetrads(ns, currentWork, totalMoney);
    prevFactionIsDone = prevFactionIsDone && theSyndicate(ns, currentWork, totalMoney);
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
    const buyRep = () => {return true;};
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
    const buyRep = () => {return true;};
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
    const buyRep = () => {return true;};
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
    const buyRep = () => {return true;};
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
    const buyRep = () => {return true;};
    const whenToStartBuying = [];
    const orderedAugs = ["CashRoot Starter Kit"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function niteSec(ns, currentWork, totalMoney) {
    const faction = "NiteSec";
    const description = null;
    const prepWork = [];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "Neural-Retention Enhancement")}
    ];
    const buyRep = () => {return true;};
    const whenToStartBuying = [];
    const orderedAugs = ["Neural-Retention Enhancement", "CRTX42-AA Gene Modification", "Artificial Synaptic Potentiation", "Neurotrainer II"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function theBlackHand1(ns, currentWork, totalMoney) {
    const faction = "The Black Hand";
    const description = null;
    const prepWork = [];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "The Black Hand")}
    ];
    const buyRep = () => {return true;};
    const whenToStartBuying = [];
    const orderedAugs = ["The Black Hand", "Cranial Signal Processors - Gen III", "DataJack", "Embedded Netburner Module"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function theBlackHand2(ns, currentWork, totalMoney) {
    const faction = "The Black Hand";
    const description = "Round 2";
    const prepWork = [];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "Neuralstimulator")}
    ];
    const buyRep = () => {return true;};
    const whenToStartBuying = [];
    const orderedAugs = ["Neuralstimulator", "Embedded Netburner Module Core Implant", "Enhanced Myelin Sheathing", "Cranial Signal Processors - Gen IV"];
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
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "Neuregen Gene Modification")}
    ];
    const buyRep = () => {return true;};
    const whenToStartBuying = [];
    const orderedAugs = ["Neuregen Gene Modification", "Speech Processor Implant", "Nuoptimal Nootropic Injector Implant"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function bitRunners1(ns, currentWork, totalMoney) {
    const faction = "BitRunners";
    const description = null;
    const prepWork = [];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "Artificial Bio-neural Network Implant")}
    ];
    const buyRep = () => {return true;};
    const whenToStartBuying = [
        () => ns.singularity.getFactionFavor(faction) + ns.singularity.getFactionFavorGain(faction) > ns.getFavorToDonate(),
    ];
    const orderedAugs = ["Artificial Bio-neural Network Implant", "Cranial Signal Processors - Gen V", "Neural Accelerator"];
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
        () => {return totalMoney > getRequiredDonation() && !haveEnoughRep}
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
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "Neuroreceptor Management Implant")}
    ];
    const buyRep = () => {return true;};
    const whenToStartBuying = [];
    const orderedAugs = ["Neuroreceptor Management Implant", "Nanofiber Weave", "Social Negotiation Assistant (S.N.A)", "ADR-V1 Pheromone Gene", "Speech Enhancement", "Wired Reflexes"];
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
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "INFRARET Enhancement")}
    ];
    const buyRep = () => {return true;};
    const whenToStartBuying = [];
    const orderedAugs = ["INFRARET Enhancement", "Combat Rib I", "Augmented Targeting I"];
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
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "NutriGen Implant")}
    ];
    const buyRep = () => {return true;};
    const whenToStartBuying = [];
    const orderedAugs = ["NutriGen Implant"];
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
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "Combat Rib II")}
    ];
    const buyRep = () => {return true;};
    const whenToStartBuying = [];
    const orderedAugs = ["Combat Rib II", "DermaForce Particle Barrier"];
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
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "PCMatrix")}
    ];
    const buyRep = () => {return true;};
    const whenToStartBuying = [];
    const orderedAugs = ["PCMatrix"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function sector12_2(ns, currentWork, totalMoney) {
    const faction = "Sector-12";
    const description = null;
    const prepWork = [
        () => {return ns.singularity.getFactionRep(faction) > 0 || ns.singularity.joinFaction(faction);}
    ];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "Augmented Targeting II")}
    ];
    const buyRep = () => {return true;};
    const whenToStartBuying = [];
    const orderedAugs = ["Augmented Targeting II"];
    return getAugsFromFaction(ns, faction, description, whenToWindDown, whenToStartBuying, orderedAugs, buyRep, prepWork);
}

/** @param {NS} ns */
function daedalus1(ns, currentWork, totalMoney) {
    const faction = "Daedalus";
    const description = null;
    const prepWork = [];
    const whenToWindDown = [
        () => {return (currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)},
        () => {return totalMoney > getAugmentPrice(ns, "Synfibril Muscle")}
    ];
    const buyRep = () => {return true;};
    const whenToStartBuying = [
        () => ns.singularity.getFactionFavor(faction) + ns.singularity.getFactionFavorGain(faction) > ns.getFavorToDonate(),
    ];
    const orderedAugs = ["Synfibril Muscle"];
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
        () => {return totalMoney > getRequiredDonation() && !haveEnoughRep}
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
function getAugmentPrice(ns, augment) {
    return ns.singularity.getAugmentationPrice(augment)
}

/** @param {NS} ns */
export function hasAugment(ns, augment, includePurchased = false) {
    const installedAugments = ns.singularity.getOwnedAugmentations(includePurchased);
    return installedAugments.indexOf(augment) !== -1
}