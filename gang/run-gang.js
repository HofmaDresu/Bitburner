
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

        const currentMembers = ns.gang.getMemberNames();
        for (let i = 0; i < currentMembers.length; i++) {
            gangInfo = ns.gang.getGangInformation();
            const member = currentMembers[i];
            let memberStats = ns.gang.getMemberInformation(member);
            memberStats = ascendIfProper(ns, memberStats);
            chooseJob(ns, gangInfo, currentMembers.length, memberStats);
            purchaseGear(ns, memberStats);
            await ns.sleep(2000);
        };

        await ns.sleep(10000)
    }
}

/** @param {NS} ns */
function ascendIfProper(ns, memberStats) {    
    // Probably want something smarter
    const ascentionInfo = ns.gang.getAscensionResult(memberStats.name);
    if (ascentionInfo) {
        if(ascentionInfo.str >= memberStats.str_asc_mult * 2) {
            ns.tprint(ascentionInfo);
            ns.tprint("ascending member");
            ns.gang.ascendMember(memberStats.name);
        }
    }
    return ns.gang.getMemberInformation(memberStats.name);
}

/** @param {NS} ns */
function chooseJob(ns, gangInfo, numberOfMembers, memberStats) {
    if (memberStats.str >= 15) {
        const bestTaskForReputation = getBestReputationTaskForGangMember(ns, gangInfo, memberStats);
        const wantedLevelGainRate = ns.formulas.gang.wantedLevelGain(gangInfo, memberStats, bestTaskForReputation);
        //ns.print(`${bestTaskForReputation.name}: ${wantedLevelGainRate} ${gangInfo.wantedLevelGainRate + wantedLevelGainRate}`);
        if (gangInfo.wantedLevelGainRate + wantedLevelGainRate <= 0) {
            ns.gang.setMemberTask(memberStats.name, bestTaskForReputation.name);
        } else {
            ns.gang.setMemberTask(memberStats.name, "Vigilante Justice");
        }
    } else if (memberStats.str < 15) {
        ns.gang.setMemberTask(memberStats.name, "Train Combat");
    }
}

/** @param {NS} ns */
function purchaseGear(ns, memberStats) {
    const potentialEquipment = ns.gang.getEquipmentNames()
        .filter(e => ["Weapon", "Armor", "Vehicle"].some(type => ns.gang.getEquipmentType(e) === type))
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
    return gangTasks.sort((a, b) => ns.formulas.gang.respectGain(gangInfo, memberStats, b) - ns.formulas.gang.respectGain(gangInfo, memberStats, a))[0];
}

/** @param {NS} ns */
function getGangTasks(ns, gangInfo) {
    return ns.gang.getTaskNames().map(ns.gang.getTaskStats).filter(ts => (ts.isCombat && !gangInfo.isHacking) || (ts.isHacking && gangInfo.isHacking));
}
