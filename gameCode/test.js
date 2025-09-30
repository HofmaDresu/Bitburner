



/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("disableLog")
    ns.disableLog("scan")
    ns.ui.openTail();
    ns.print(ns.singularity.getCurrentWork())
}