
export const STOCK_HISTORY_FILE_NAME = "database/stockHistory.js";

/** @param {NS} ns */
export function getStockHistory(ns) {    
    let stockHistoryData = {};
    try {
        stockHistoryData = JSON.parse(ns.read(STOCK_HISTORY_FILE_NAME));
    } catch {}
    return stockHistoryData;
}

/** @param {NS} ns */
export function canTradeStocks(ns) {    
    return ns.stock.hasWSEAccount() && ns.stock.hasTIXAPIAccess();
}

export function getStockCommission() {
    return 100_000;
}

/** @param {NS} ns */
function iOwnStocks(ns) {
    const symbols = ns.stock.getSymbols();
    for (const symbol of symbols) {
        const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
        if (sharesLong || sharesShort) {
            return true;
        }
    }
    return false;
}