import { runScriptAtMaxThreads } from "helpers";

/** @param {NS} ns */
export async function main(ns) {    
    await runScriptAtMaxThreads(ns, "factions/shareMemory.js", ns.getHostname(), []);
}