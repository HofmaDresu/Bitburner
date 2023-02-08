/** @param {NS} ns */
export async function main(ns) {	
    while(true) {
        const serverMoney = ns.getServerMoneyAvailable("home");
        const sellCost = ns.hacknet.hashCost("Sell for Money");
        const currentHash = ns.hacknet.numHashes();

        //TODO: Much smarter, do more
        if (sellCost < currentHash) {
            ns.hacknet.spendHashes("Sell for Money");
        }


        await ns.sleep(1_000);
    }

}