import { STOCK_HISTORY_FILE_NAME, getStockHistory, canTradeStocks } from "stocks/helpers";

/** @param {NS} ns */
export async function main(ns) {
    while (!canTradeStocks(ns)) {
        await ns.stock.nextUpdate();
    }

    const symbols = ns.stock.getSymbols();
    while(true) {
        const prices = getPrices(ns, symbols);
        storePrices(ns, symbols, prices);
        await ns.stock.nextUpdate();
    }
}

/** @param {NS} ns */
function getPrices(ns, symbols) {
    const prices = {};

    symbols.forEach(s => {
        prices[s] = ns.stock.getPrice(s);
    });

    return prices;
}

/** @param {NS} ns */
function storePrices(ns, symbols, prices) {
    let stockHistoryData = getStockHistory(ns);

    symbols.forEach(s => {
        stockHistoryData[s] = {
            min: Math.min(prices[s], stockHistoryData[s]?.min || Infinity),
            max: Math.max(prices[s], stockHistoryData[s]?.max || 0),
        };
    });

    ns.write(STOCK_HISTORY_FILE_NAME, JSON.stringify(stockHistoryData), "w");
}