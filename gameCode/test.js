
// import * as helpers from "helpers";
// import * as controlHelpers from "control/helpers";
import * as stockHelpers from "stocks/helpers";


/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("disableLog")
    ns.disableLog("scan")
    ns.ui.openTail();
    ns.print(stockHelpers.getStockSellValue(ns))
}