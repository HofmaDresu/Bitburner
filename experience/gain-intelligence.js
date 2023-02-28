import {getMaxContractSolverRam} from 'helpers';

export const MAX_MANUAL_HACKS = 1000;
export const MANUAL_HACK_SCRIPT = "/experience/manual-hack-self.js";

/** @param {NS} ns */
export async function main(ns) {
	const minMemory = Math.max(ns.getServerMaxRam("home") * .1, getMaxContractSolverRam(ns));
	let availableMemory = Math.max(ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - minMemory, 0);
	const manualHackRam = ns.getScriptRam(MANUAL_HACK_SCRIPT);
	const hackThreads = Math.min(Math.floor(availableMemory / manualHackRam), MAX_MANUAL_HACKS);
	const existingManualHacks = ns.ps("home").map(ps => ps.filename).filter(fn => fn === MANUAL_HACK_SCRIPT).length
	for(let i = 0; i < hackThreads && existingManualHacks + i + 1 <= MAX_MANUAL_HACKS; i++) {
		ns.run(MANUAL_HACK_SCRIPT, 1, crypto.randomUUID());
		await ns.sleep(1);
	}
}