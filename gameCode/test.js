
import { getServers } from "helpers";
import { crackServers } from "control/helpers";
import { startScriptOnHomeIfAble, getConfig, CONFIG_NODE_MULTIPLIERS} from "helpers";


/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("disableLog")
    ns.disableLog("scan")
    ns.ui.openTail();
    ns.print(ns.singularity.getCurrentWork())
}