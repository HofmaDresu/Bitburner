import {getMaxContractSolverRam} from 'helpers';

/** @param {NS} ns */
export async function main(ns) {
	const script = "/experience/manual-hack-self.js";
	const minMemory = Math.max(ns.getServerMaxRam("home") * .1, getMaxContractSolverRam(ns));
	let availableMemory = Math.max(ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - minMemory, 0);
	const manualHackRam = ns.getScriptRam('/experience/manual-hack-self.js');
	const hackThreads = Math.min(Math.floor(availableMemory / manualHackRam), 1000);
	const existingManualHacks = ns.ps("home").map(ps => ps.filename).filter(fn => fn === script).length
	for(let i = existingManualHacks; i < hackThreads; i++) {
		ns.run(script, 1);
		await ns.sleep(1);
	}
}