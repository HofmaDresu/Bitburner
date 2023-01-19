import { getWarPrepStatus } from "gang/helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("sleep");
    while(true) {
        if (!ns.gang.inGang()) continue;
        let gangInfo = ns.gang.getGangInformation();
        

        if (ns.gang.canRecruitMember()) {
            const newMemberName = crypto.randomUUID();
            ns.gang.recruitMember(newMemberName);
        }

        const currentMembers = ns.gang.getMemberNames().map(ns.gang.getMemberInformation);
        const prepareForWar = currentMembers.every(m => m.str_asc_mult > 20 && m.def_asc_mult > 20);
        for (let i = 0; i < currentMembers.length; i++) {
            gangInfo = ns.gang.getGangInformation();
            let memberStats = currentMembers[i];
            if (memberStats.str_asc_mult <= 20 && memberStats.def_asc_mult <= 20) {
                memberStats = ascendIfProper(ns, memberStats);
            }
            chooseJob(ns, gangInfo, memberStats, prepareForWar);
            purchaseGear(ns, memberStats);
            await ns.sleep(2000);
        };

        
	    const otherGangInfo = ns.gang.getOtherGangInformation();
        const shouldGoToWar = gangInfo.power > Math.max(...Object.keys(otherGangInfo).map(k => otherGangInfo[k].power)) * 2;
        ns.gang.setTerritoryWarfare(shouldGoToWar);

        await ns.sleep(60000)
    }
}

/** @param {NS} ns */
function ascendIfProper(ns, memberStats) {    
    // Probably want something smarter
    const ascentionInfo = ns.gang.getAscensionResult(memberStats.name);
    if (ascentionInfo) {
        if(ascentionInfo.str >= memberStats.str_asc_mult * 2) {
            ns.gang.ascendMember(memberStats.name);
        }
    }
    return ns.gang.getMemberInformation(memberStats.name);
}

/** @param {NS} ns */
function chooseJob(ns, gangInfo, memberStats, prepareForWar) {
    if (getWarPrepStatus(ns) || prepareForWar) {
        changeJob(ns, memberStats, "Territory Warfare");
    } else if (memberStats.str >= 15) {
        const bestTaskForReputation = getBestReputationTaskForGangMember(ns, gangInfo, memberStats);
        const wantedLevelGainRate = ns.formulas.gang.wantedLevelGain(gangInfo, memberStats, bestTaskForReputation);
        //ns.print(`${bestTaskForReputation.name}: ${wantedLevelGainRate} ${gangInfo.wantedLevelGainRate + wantedLevelGainRate}`);

        if((new Date).getMinutes() % 5 === 0) {
            changeJob(ns, memberStats, "Train Combat");
        } else if (gangInfo.wantedLevelGainRate + wantedLevelGainRate <= 0) {
            changeJob(ns, memberStats, bestTaskForReputation.name);
        } else {
            changeJob(ns, memberStats, "Vigilante Justice");
        }
    } else if (memberStats.str < 15) {
        changeJob(ns, memberStats, "Train Combat");
    }
}

/** @param {NS} ns */
function changeJob(ns, memberStats, newJob) {
    if (memberStats.task !== newJob) {
        ns.gang.setMemberTask(memberStats.name, newJob);
    }
}

/** @param {NS} ns */
function purchaseGear(ns, memberStats) {
    const potentialEquipment = ns.gang.getEquipmentNames()
        .filter(e => !memberStats.upgrades.some(me => me === e));
    const purchasableEquipment = potentialEquipment
        .filter(e => ns.gang.getEquipmentCost(e) < ns.getServerMoneyAvailable("home"))
        .sort((a, b) => ns.gang.getEquipmentCost(a) - ns.gang.getEquipmentCost(b));
    if (purchasableEquipment.length > 0) {
        ns.gang.purchaseEquipment(memberStats.name, purchasableEquipment[0]);
    }
}

/** @param {NS} ns */
function getBestReputationTaskForGangMember(ns, gangInfo, memberStats) {
    const gangTasks = getGangTasks(ns, gangInfo);
    const vigilanteJusticeStats = ns.gang.getTaskStats("Vigilante Justice");
    return gangTasks
        .filter(t => ns.formulas.gang.wantedLevelGain(gangInfo, memberStats, t) <= Math.abs(ns.formulas.gang.wantedLevelGain(gangInfo, memberStats, vigilanteJusticeStats)))
        .sort((a, b) => ns.formulas.gang.respectGain(gangInfo, memberStats, b) - ns.formulas.gang.respectGain(gangInfo, memberStats, a))[0];
}

/** @param {NS} ns */
function getGangTasks(ns, gangInfo) {
    return ns.gang.getTaskNames().map(ns.gang.getTaskStats).filter(ts => (ts.isCombat && !gangInfo.isHacking) || (ts.isHacking && gangInfo.isHacking));
}
