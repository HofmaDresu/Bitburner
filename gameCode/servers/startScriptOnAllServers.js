import { getBestServerToHack } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    const servers = ns.scan("home").filter((s) => s.indexOf("pserv") !== -1);

    for (const server of servers) {
        const bestServerToHack =  getBestServerToHack(ns);
        ns.scp(["control/makeMoneyFromTarget.js", "growing/growTargetToMax.js", "hacking/hackTarget.js", "weakening/weakenTargetToMin.js"], server);
        ns.exec("control/makeMoneyFromTarget.js", server, 1, bestServerToHack);
        await ns.sleep(100);
    }
}