import { getConfig } from "helpers";



/** @param {NS} ns */
export async function main(ns) {
    ns.ui.openTail();
    const foo = getConfig(ns);
    ns.print(ns.getMoneySources().sinceInstall.hacknet * 100);
    ns.print(ns.getMoneySources().sinceInstall.hacking);
}