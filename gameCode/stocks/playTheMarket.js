import { getStockHistory, canTradeStocks, getStockCommission } from "stocks/helpers";
import { availableSpendingMoney, getConfig, CONFIG_BUY_STOCKS } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('getServerMoneyAvailable');
    while (!canTradeStocks(ns)) {
        await ns.stock.nextUpdate();
    }

    const symbols = ns.stock.getSymbols();
    while(true) {
        let stockHistoryData = getStockHistory(ns);

        symbols.forEach(symbol => {
            buyLongIfAppropriate(ns, symbol, stockHistoryData[symbol]?.min || -1, stockHistoryData[symbol]?.max || -1);            
            sellLongIfAppropriate(ns, symbol, stockHistoryData[symbol]?.min || 0, stockHistoryData[symbol]?.max || Infinity);
        });
        await ns.stock.nextUpdate();
    }
}

/** @param {NS} ns */
function buyLongIfAppropriate(ns, symbol, min, max) {
    if (!getConfig(ns)[CONFIG_BUY_STOCKS]) return;
    // Not enough potential profit in spread
    if ((max - min) * ns.stock.getMaxShares(symbol) < minPotentialProfit()) return;
    const askPrice = ns.stock.getAskPrice(symbol)
    // Not enough potential profit at current price
    if (askPrice > min * 1.1) return;
    // Already hold this stock
    const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
    if (sharesLong > 0) return;

    const availableMoney = availableSpendingMoney(ns);
    if (availableMoney < 1_000_000_000) return;
    const sharesICanBuy = Math.floor(availableMoney / askPrice);
    // Not enough potential profit given current monies
    if ((sharesICanBuy * max * .9) - (sharesICanBuy * askPrice) < minPotentialProfit()) return;
    ns.stock.buyStock(symbol, sharesICanBuy);
}

/** @param {NS} ns */
function sellLongIfAppropriate(ns, symbol, min, max) {
    const bidPrice = ns.stock.getBidPrice(symbol);
    const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
    if (sharesLong > 0) return;
    // Not enough profit
    if((bidPrice * sharesLong) - (avgLongPrice * sharesLong) < minPotentialProfit()) return;
    // Not close enough to max
    if(bidPrice < max * .9) return;
    ns.print(`Selling ${sharesLong} shares of ${symbol} at $${ns.formatNumber(bidPrice, 2)} for $${ns.formatNumber(sharesLong * bidPrice, 2)}`);
    ns.stock.sellStock(symbol, sharesLong);    
}

function minPotentialProfit() {
    return getStockCommission() * 200;
}