/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0];
    const args = [target];    
    
    const moneyThresh = ns.getServerMaxMoney(target);
    const player = ns.getPlayer();
    const securityThresh = ns.getServerMinSecurityLevel(target);

    if (player.skills.hacking < securityThresh) return;
    if (moneyThresh === 0) return;

    if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(target);
    }
    ns.nuke(target);

    ns.scp(["control/makeMoneyFromTarget.js", "growing/growTargetToMax.js", "hacking/hackTarget.js", "weakening/weakenTargetToMin.js"], target);
    ns.exec("control/makeMoneyFromTarget.js", target, 1, target);
}