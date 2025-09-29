import { getConfig } from "helpers";



/** @param {NS} ns */
export async function main(ns) {
    ns.ui.openTail();
    ns.print(ns.flags([["canUseAllMoney", false]])["canUseAllMoney"]);
}