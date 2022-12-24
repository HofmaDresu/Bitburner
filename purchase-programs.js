/** @param {NS} ns */
export async function main(ns) {
	if (!ns.singularity) return;
	while (!ns.singularity.purchaseTor()) {
		await ns.sleep(60000);
	}

	while (!ns.fileExists("Formulas.exe")) {
		ns.singularity.getDarkwebPrograms().forEach(program => {
			if (!ns.fileExists(program) && ns.getServerMoneyAvailable("home") > ns.singularity.getDarkwebProgramCost(program)) {
				ns.singularity.purchaseProgram(program);
			}
		});

		await ns.sleep(60000);
	}
}
