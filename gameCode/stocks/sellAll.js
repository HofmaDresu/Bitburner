import { canTradeStocks, getSingleStockSellValue } from "stocks/helpers";

/** @param {NS} ns */
export async function main(ns) {
    while (!canTradeStocks(ns)) {
        await ns.stock.nextUpdate();
    }

    sellAll(ns);
}

/** @param {NS} ns */
export function sellAll(ns) {
    if (!canTradeStocks(ns)) {
       return;
    }

    const symbols = ns.stock.getSymbols();
    for (const symbol of symbols) {
        if (getSingleStockSellValue(ns, symbol) < 0) continue;
        const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
        if(sharesLong) {
            ns.stock.sellStock(symbol, sharesLong);
        }
        if(sharesShort) {
            ns.stock.sellShort(symbol, sharesShort);
        }
    };
}