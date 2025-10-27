
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
export function iOwnStocks(ns) {
    const symbols = ns.stock.getSymbols();
    for (const symbol of symbols) {
        const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
        if (sharesLong || sharesShort) {
            return true;
        }
    }
    return false;
}

/** @param {NS} ns */
export function getStockSellValue(ns) {
    if (!iOwnStocks(ns)) return 0;
    const symbols = ns.stock.getSymbols();
    return symbols.reduce((total, symbol) => {
        const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
        if (sharesLong) {
            const bidPrice = ns.stock.getBidPrice(symbol);
            return total + ((bidPrice * sharesLong) - getStockCommission());
        }
        if (sharesShort) {
            const askPrice = ns.stock.getAskPrice(symbol);
            return total + ((askPrice * sharesShort) - getStockCommission());
        }
        return total;
    }, 0)
}