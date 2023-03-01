import { getMoneyCrime } from "crime/helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.tprint(getMoneyCrime(ns));
}