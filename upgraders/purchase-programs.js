/** @param {NS} ns */
export async function main(ns) {
	if (!ns.singularity) return;
	while (!ns.singularity.purchaseTor()) {
		await ns.sleep(60000);
	}

	let unpurchasedDarkWebPrograms = ns.singularity.getDarkwebPrograms().filter(program => !ns.fileExists(program));

	while (unpurchasedDarkWebPrograms.length > 0) {
		unpurchasedDarkWebPrograms.forEach(program => {
			if (!ns.fileExists(program) && ns.getServerMoneyAvailable("home") > ns.singularity.getDarkwebProgramCost(program)) {
				ns.singularity.purchaseProgram(program);
			}
		});
		
		unpurchasedDarkWebPrograms = ns.singularity.getDarkwebPrograms().filter(program => !ns.fileExists(program));
		await ns.sleep(60000);
	}
}
