import { getTrainingCrime } from "crime/helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.tprint(getTrainingCrime(ns));
}