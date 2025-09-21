import { getBestServerToHack, copyAndRunHackingScripts } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    const servers = ns.scan("home").filter((s) => s.indexOf("pserv") !== -1);

    for (const server of servers) {
        const bestServerToHack =  getBestServerToHack(ns);
        copyAndRunHackingScripts(ns, server, bestServerToHack);
        await ns.sleep(100);
    }
}