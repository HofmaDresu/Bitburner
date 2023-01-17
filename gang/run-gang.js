
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("sleep");
    while(true) {
        if (!ns.gang.inGang()) continue;
        const gangInfo = ns.gang.getGangInformation();

        if (ns.gang.canRecruitMember()) {
            const currentMemberCount = ns.gang.getMemberNames().length;
            const newMemberName = `${currentMemberCount+1}`
            ns.gang.recruitMember(newMemberName);

            ns.gang.setMemberTask(newMemberName, "Train Combat");
        }

        const currentMembers = ns.gang.getMemberNames();
        currentMembers.forEach(member => {
            const memberStats = ns.gang.getMemberInformation(member);
            chooseJob(ns, gangInfo, memberStats);
            purchaseGear(ns, memberStats);
        });

        await ns.sleep(60000)
    }
}

/** @param {NS} ns */
function chooseJob(ns, gangInfo, memberStats) {
    if (memberStats.str >= 15 && memberStats.task == "Train Combat") {
        if (gangInfo.wantedLevelGainRate <= 0) {
            ns.gang.setMemberTask(memberStats.name, "Mug People");
        } else {
            ns.gang.setMemberTask(memberStats.name, "Vigilante Justice");
        }
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