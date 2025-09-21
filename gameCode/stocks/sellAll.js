import { canTradeStocks } from "stocks/helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('getServerMoneyAvailable');
    while (!canTradeStocks(ns)) {
        await ns.stock.nextUpdate();
    }

    const symbols = ns.stock.getSymbols();
    symbols.forEach(symbol => {
        const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
        if(sharesLong) {
            ns.stock.sellStock(symbol, sharesLong);
        }
        if(sharesShort) {
            ns.stock.sellShort(symbol, sharesShort);
        }
    });
}