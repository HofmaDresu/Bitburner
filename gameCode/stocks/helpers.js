
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