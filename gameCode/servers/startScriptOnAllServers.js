/** @param {NS} ns */
export async function main(ns) {
    const servers = ns.scan("home").filter((s) => s.indexOf("pserv") !== -1);

    for (const server of servers) {
        ns.scp(["control/makeMoneyFromTarget.js", "growing/growTargetToMax.js", "hacking/hackTarget.js", "weakening/weakenTargetToMin.js"], server);
        ns.exec("control/makeMoneyFromTarget.js", server, 1, "joesguns");
        await ns.sleep(1000);
    }
}