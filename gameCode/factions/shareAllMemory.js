import { runScriptAtMaxThreads } from "helpers";

/** @param {NS} ns */
export async function main(ns) {    
    runScriptAtMaxThreads(ns, "factions/shareMemory.js", ns.getHostname(), [Math.random().toString()]);
}