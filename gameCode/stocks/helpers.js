
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
            // ns.print(`${symbol}: long ${ns.formatNumber ((bidPrice * sharesLong) - getStockCommission())}`)
            return total + ((bidPrice * sharesLong) - getStockCommission());
        }
        if (sharesShort) {
            const askPrice = ns.stock.getAskPrice(symbol);
            // ns.print(`${symbol}: short ${ns.formatNumber(((sharesShort * (2 * avgShortPrice - askPrice)) - getStockCommission()))}`)
            return total + ((sharesShort * (2 * avgShortPrice - askPrice)) - getStockCommission());
        }
        return total;
    }, 0)
}