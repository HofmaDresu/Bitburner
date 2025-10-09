import { startScriptOnHomeIfAble, getConfig, CONFIG_NODE_MULTIPLIERS} from "helpers";

/** @param {NS} ns */
export default async function advanceThroughHacking(ns) {
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
    if (ns.getServerMaxRam("home") >= 128 && !hasAugment(ns, "Synaptic Enhancement Implant")) {
        const faction = "CyberSec";
        ns.print("Starting faction " + faction);
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            if(totalMoney < getAugmentPrice(ns, "Cranial Signal Processors - Gen II")) return;
            startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
            if(!(getAugmentIfAble(ns, faction, "Cranial Signal Processors - Gen I"))) return;
            if(!(getAugmentIfAble(ns, faction, "Cranial Signal Processors - Gen II"))) return;
            if(!(getAugmentIfAble(ns, faction, "BitWire"))) return;
            if(!(getAugmentIfAble(ns, faction, "Synaptic Enhancement Implant"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }
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
    if(hasAugment(ns, "CashRoot Starter Kit") && !hasAugment(ns, "Neurotrainer II")) {
        const faction = "NiteSec";
        ns.print("Starting faction " + faction);
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            if(totalMoney < getAugmentPrice(ns, "Neural-Retention Enhancement") + 1.9 * getAugmentPrice(ns, "CRTX42-AA Gene Modification")) return;
            startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
            if(!(getAugmentIfAble(ns, faction, "Neural-Retention Enhancement"))) return;
            if(!(getAugmentIfAble(ns, faction, "CRTX42-AA Gene Modification"))) return;
            if(!(getAugmentIfAble(ns, faction, "Artificial Synaptic Potentiation"))) return;
            if(!(getAugmentIfAble(ns, faction, "Neurotrainer II"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }
    if(hasAugment(ns, "Neurotrainer II") && !hasAugment(ns, "Embedded Netburner Module")) {
        const faction = "The Black Hand";
        ns.print("Starting faction " + faction + " 1");
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            if(totalMoney < getAugmentPrice(ns, "The Black Hand")) return;
            startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
            if(!(getAugmentIfAble(ns, faction, "The Black Hand"))) return;
            if(!(getAugmentIfAble(ns, faction, "Cranial Signal Processors - Gen III"))) return;
            if(!(getAugmentIfAble(ns, faction, "DataJack"))) return;
            if(!(getAugmentIfAble(ns, faction, "Embedded Netburner Module"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }
    if(hasAugment(ns, "Embedded Netburner Module") && !hasAugment(ns, "Cranial Signal Processors - Gen IV")) {
        const faction = "The Black Hand";
        ns.print("Starting faction " + faction + " 2");
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            if(totalMoney < getAugmentPrice(ns, "Neuralstimulator")) return;
            startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
            if(!(getAugmentIfAble(ns, faction, "Neuralstimulator"))) return;
            if(!(getAugmentIfAble(ns, faction, "Embedded Netburner Module Core Implant"))) return;
            if(!(getAugmentIfAble(ns, faction, "Enhanced Myelin Sheathing"))) return;
            if(!(getAugmentIfAble(ns, faction, "Cranial Signal Processors - Gen IV"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }    
    if(hasAugment(ns, "Cranial Signal Processors - Gen IV") && !hasAugment(ns, "Nuoptimal Nootropic Injector Implant")) {
        const faction = "Chongqing";
        ns.print("Starting faction " + faction);
        ns.singularity.travelToCity("Chongqing");
        ns.singularity.joinFaction(faction);
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            if(totalMoney < getAugmentPrice(ns, "Neuregen Gene Modification")) return;
            startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
            if(!(getAugmentIfAble(ns, faction, "Neuregen Gene Modification"))) return;
            if(!(getAugmentIfAble(ns, faction, "Speech Processor Implant"))) return;
            if(!(getAugmentIfAble(ns, faction, "Nuoptimal Nootropic Injector Implant"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }    
    if(hasAugment(ns, "Nuoptimal Nootropic Injector Implant") && !hasAugment(ns, "Neural Accelerator")) {
        const faction = "BitRunners";
        ns.print("Starting faction " + faction + " 1");
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            if(totalMoney < getAugmentPrice(ns, "Artificial Bio-neural Network Implant")) return;
            startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
            if(ns.singularity.getFactionFavor(faction) + ns.singularity.getFactionFavorGain(faction) < ns.getFavorToDonate()) return;
            if(!(getAugmentIfAble(ns, faction, "Artificial Bio-neural Network Implant"))) return;
            if(!(getAugmentIfAble(ns, faction, "Cranial Signal Processors - Gen V"))) return;
            if(!(getAugmentIfAble(ns, faction, "Neural Accelerator"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }
    if(hasAugment(ns, "Neural Accelerator") && !hasAugment(ns, "BitRunners Neurolink")) {
        const faction = "BitRunners";
        ns.print("Starting faction " + faction + " 2");
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            const highestRepCost = ns.singularity.getAugmentationRepReq("Embedded Netburner Module Core V2 Upgrade")
            const currentRep = ns.singularity.getFactionRep(faction);
            const haveEnoughRep = currentRep >= highestRepCost;
            if (!ns.fileExists("Formulas.exe")) return;
            const requiredDonation = ns.formulas.reputation.donationForRep(highestRepCost - currentRep, ns.getPlayer())
            if(totalMoney < requiredDonation && !haveEnoughRep) return;
            // Not sharing memory because we're purchasing rep OR we've got enough
            startScriptOnHomeIfAble(ns, "windDown.js");
            if(!(haveEnoughRep || ns.singularity.donateToFaction(faction, requiredDonation))) return;
            if(!(getAugmentIfAble(ns, faction, "Embedded Netburner Module Core V2 Upgrade"))) return;
            if(!(getAugmentIfAble(ns, faction, "BitRunners Neurolink"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }

    const requiredAugs = getConfig(ns)[CONFIG_NODE_MULTIPLIERS]["DaedalusAugsRequirement"];
    if(ns.singularity.getOwnedAugmentations().length < requiredAugs.length) {
        if(hasAugment(ns, "BitRunners Neurolink") && !hasAugment(ns, "Wired Reflexes")) {
            const faction = "Tian Di Hui";
            ns.print("Starting faction " + faction);
            ns.singularity.travelToCity("Ishima");
            if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
                if(totalMoney < getAugmentPrice(ns, "Neuregen Gene Modification")) return;
                startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
                if(!(getAugmentIfAble(ns, faction, "Neuroreceptor Management Implant"))) return;
                if(!(getAugmentIfAble(ns, faction, "Nanofiber Weave"))) return;
                if(!(getAugmentIfAble(ns, faction, "Social Negotiation Assistant (S.N.A)"))) return;
                if(!(getAugmentIfAble(ns, faction, "ADR-V1 Pheromone Gene"))) return;
                if(!(getAugmentIfAble(ns, faction, "Speech Enhancement"))) return;
                if(!(getAugmentIfAble(ns, faction, "Wired Reflexes"))) return;
                maxOutNeuroFlux(ns, faction);
                installAugments(ns);
            }
        }
        if(hasAugment(ns, "Wired Reflexes") && !hasAugment(ns, "Augmented Targeting I")) {
            const faction = "Ishima";
            ns.print("Starting faction " + faction);
            ns.singularity.travelToCity("Ishima");
            ns.singularity.joinFaction(faction);
            if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
                if(totalMoney < getAugmentPrice(ns, "Neuregen Gene Modification")) return;
                startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
                if(!(getAugmentIfAble(ns, faction, "Speech Processor Implant"))) return;
                if(!(getAugmentIfAble(ns, faction, "INFRARET Enhancement"))) return;
                if(!(getAugmentIfAble(ns, faction, "Combat Rib I"))) return;
                if(!(getAugmentIfAble(ns, faction, "Augmented Targeting I"))) return;
                maxOutNeuroFlux(ns, faction);
                installAugments(ns);
            }
        }
        if(hasAugment(ns, "Augmented Targeting I") && !hasAugment(ns, "NutriGen Implant")) {
            const faction = "New Tokyo";
            ns.print("Starting faction " + faction);
            ns.singularity.travelToCity("New Tokyo");
            if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
                if(totalMoney < getAugmentPrice(ns, "Neuregen Gene Modification")) return;
                startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
                if(!(getAugmentIfAble(ns, faction, "NutriGen Implant"))) return;
                maxOutNeuroFlux(ns, faction);
                installAugments(ns);
            }
        }
        if(hasAugment(ns, "NutriGen Implant") && !hasAugment(ns, "DermaForce Particle Barrier")) {
            const faction = "Volhaven";
            ns.print("Starting faction " + faction);
            ns.singularity.travelToCity("Volhaven");
            if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
                if(totalMoney < getAugmentPrice(ns, "Neuregen Gene Modification")) return;
                startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
                if(!(getAugmentIfAble(ns, faction, "Combat Rib II"))) return;
                if(!(getAugmentIfAble(ns, faction, "DermaForce Particle Barrier"))) return;
                maxOutNeuroFlux(ns, faction);
                installAugments(ns);
            }
        }

        // Travel to Aevum

        return;
    }

    
    if(hasAugment(ns, "BitRunners Neurolink") && !hasAugment(ns, "Synfibril Muscle")) {
        const faction = "Daedalus";
        ns.print("Starting faction " + faction + " 1");
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            if(totalMoney < getAugmentPrice(ns, "Synfibril Muscle")) return;
            startScriptOnHomeIfAble(ns, "windDown.js", ["--shareMemory"]);
            if(ns.singularity.getFactionFavor(faction) + ns.singularity.getFactionFavorGain(faction) < ns.getFavorToDonate()) return;
            if(!(getAugmentIfAble(ns, faction, "Synfibril Muscle"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }
    if(hasAugment(ns, "Synfibril Muscle") && !hasAugment(ns, "The Red Pill")) {
        const faction = "Daedalus";
        ns.print("Starting faction " + faction + " 2");
        if ((currentWork?.type === "FACTION" && currentWork?.factionName === faction) || ns.singularity.workForFaction(faction, "hacking", true)) {
            const highestRepCost = ns.singularity.getAugmentationRepReq("The Red Pill")
            const currentRep = ns.singularity.getFactionRep(faction);
            const haveEnoughRep = currentRep >= highestRepCost;
            if (!ns.fileExists("Formulas.exe")) return;
            const requiredDonation = ns.formulas.reputation.donationForRep(highestRepCost - currentRep, ns.getPlayer())
            if(totalMoney < requiredDonation && !haveEnoughRep) return;
            // Not sharing memory because we're purchasing rep OR we've got enough
            startScriptOnHomeIfAble(ns, "windDown.js");
            if(!(haveEnoughRep || ns.singularity.donateToFaction(faction, requiredDonation))) return;
            if(!(getAugmentIfAble(ns, faction, "Embedded Netburner Module Direct Memory Access Upgrade"))) return;
            if(!(getAugmentIfAble(ns, faction, "Embedded Netburner Module Core V3 Upgrade"))) return;
            if(!(getAugmentIfAble(ns, faction, "Embedded Netburner Module Analyze Engine"))) return;
            if(!(getAugmentIfAble(ns, faction, "The Red Pill"))) return;
            maxOutNeuroFlux(ns, faction);
            installAugments(ns);
        }
    }
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