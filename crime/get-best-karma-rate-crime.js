import { getKarmaCrime } from "crime/helpers";

/** @param {NS} ns */
export async function main(ns) {    
    ns.tprint(getKarmaCrime(ns));
}