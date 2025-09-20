/** @param {NS} ns */
export async function main(ns) {
    let hostname = "joesguns";
    ns.scp(["control/makeMoneyFromTarget.js", "growing/growTargetToMax.js", "hacking/hackTarget.js", "weakening/weakenTargetToMin.js"], hostname);
    ns.exec("control/makeMoneyFromTarget.js", hostname, 1, "joesguns");
}