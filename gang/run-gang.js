import { getWarPrepStatus } from "gang/helpers";

const TARGET_ASC_MULT = 20.0;

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

        const otherGangNames = Object.keys(ns.gang.getOtherGangInformation()).filter(k => k !== gangInfo.faction);
	    const otherGangs = otherGangNames.map(k => ns.gang.getOtherGangInformation()[k]);
        const currentMembers = ns.gang.getMemberNames().map(ns.gang.getMemberInformation);
        const gangIsFull = currentMembers.length === 12
        const anyPurposeForWar = gangInfo.territory < 1;
        const allMembersHaveWarAscentions = currentMembers.every(m => m.str_asc_mult > TARGET_ASC_MULT && m.def_asc_mult > TARGET_ASC_MULT);
        const allMembersHaveAllGear = currentMembers.every(m => !ns.gang.getEquipmentNames().some(e => !(m.upgrades.some(me => me === e) || m.augmentations.some(me => me === e))));
        const readyForWar = anyPurposeForWar && gangIsFull && allMembersHaveWarAscentions && allMembersHaveAllGear;
        const prepareForWar = readyForWar && Math.min(...otherGangNames.map(ogn => ns.gang.getChanceToWinClash(ogn))) < .95;
        for (let i = 0; i < currentMembers.length; i++) {
            gangInfo = ns.gang.getGangInformation();
            let memberStats = currentMembers[i];
            memberStats = ascendIfProper(ns, memberStats, prepareForWar);
            chooseJob(ns, gangInfo, memberStats, prepareForWar, gangIsFull);
            purchaseGear(ns, memberStats);
            await ns.sleep(2000);
        };

        //TODO: only look at gangs with territory
        const sufficientPowerForWar = gangInfo.power > Math.max(...otherGangs.map(og => og.power)) * 4;
        const shouldGoToWar = sufficientPowerForWar && readyForWar;
        ns.gang.setTerritoryWarfare(shouldGoToWar);

        await ns.sleep(60000)
    }
}

/** @param {NS} ns */
function ascendIfProper(ns, memberStats, prepareForWar) {
    if (prepareForWar) return memberStats;
    const ascentionInfo = ns.gang.getAscensionResult(memberStats.name);
    const ascentionStrMultiplier = TARGET_ASC_MULT > memberStats.str_asc_mult ? Math.min(2, TARGET_ASC_MULT / memberStats.str_asc_mult) : 2;
    const ascentionDefMultiplier = TARGET_ASC_MULT > memberStats.def_asc_mult ? Math.min(2, TARGET_ASC_MULT / memberStats.def_asc_mult) : 2;
    if (ascentionInfo) {
        if(ascentionInfo.str >= ascentionStrMultiplier && ascentionInfo.def >= ascentionDefMultiplier) {
            ns.gang.ascendMember(memberStats.name);
        }
    }
    return ns.gang.getMemberInformation(memberStats.name);
}

/** @param {NS} ns */
function chooseJob(ns, gangInfo, memberStats, prepareForWar, haveMaxMembers) {
    if (getWarPrepStatus(ns) || prepareForWar) {
        if((new Date).getMinutes() % 5 === 0) {
            changeJob(ns, memberStats, "Train Combat");
        } else {
            changeJob(ns, memberStats, "Territory Warfare");
        }
    } else if (haveMaxMembers && memberStats.str >= 15) {
        const bestTaskForMoney = getBestMoneyTaskForGangMember(ns, gangInfo, memberStats);
        const wantedLevelGainRate = ns.formulas.gang.wantedLevelGain(gangInfo, memberStats, bestTaskForMoney);
        //ns.print(`${bestTaskForMoney.name}: ${wantedLevelGainRate} ${gangInfo.wantedLevelGainRate + wantedLevelGainRate}`);

        if((new Date).getMinutes() % 5 === 0) {
            changeJob(ns, memberStats, "Train Combat");
        } else if (gangInfo.wantedLevelGainRate + wantedLevelGainRate <= 0) {
            changeJob(ns, memberStats, bestTaskForMoney.name);
        } else {
            changeJob(ns, memberStats, "Vigilante Justice");
        }
    }  else if (memberStats.str >= 15) {
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
        .filter(e => !(memberStats.upgrades.some(me => me === e) || memberStats.augmentations.some(me => me === e)));
    const purchasableEquipment = potentialEquipment
        .filter(e => ns.gang.getEquipmentCost(e) < ns.getServerMoneyAvailable("home"))
        .sort((a, b) => ns.gang.getEquipmentCost(a) - ns.gang.getEquipmentCost(b));
    if (purchasableEquipment.length > 0) {
        ns.gang.purchaseEquipment(memberStats.name, purchasableEquipment[0]);
    }
}

/** @param {NS} ns */
function getBestMoneyTaskForGangMember(ns, gangInfo, memberStats) {
    const gangTasks = getGangTasks(ns, gangInfo);
    const vigilanteJusticeStats = ns.gang.getTaskStats("Vigilante Justice");
    return gangTasks
        .filter(t => ns.formulas.gang.wantedLevelGain(gangInfo, memberStats, t) <= Math.abs(ns.formulas.gang.wantedLevelGain(gangInfo, memberStats, vigilanteJusticeStats)))
        .sort((a, b) => ns.formulas.gang.moneyGain(gangInfo, memberStats, b) - ns.formulas.gang.moneyGain(gangInfo, memberStats, a))[0];
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
