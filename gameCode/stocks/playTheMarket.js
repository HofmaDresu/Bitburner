import { getStockHistory, canTradeStocks, getStockCommission, getSingleStockSellValue, iOwnStocks } from "stocks/helpers";
import { availableSpendingMoney, getConfig, CONFIG_BUY_STOCKS, moneyHeldIncludingStocks } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('getServerMoneyAvailable');
    let tickCounter = 0;
    const tickMax = 10 * 60;
    while (!canTradeStocks(ns)) {
        await ns.sleep(6_000);
        tickCounter++;
    }

    const symbols = ns.stock.getSymbols();
    while(true) {
        // 10 minutes, but because each tick is 4-6 seconds it's 40-60 in-game minutes
        if (!iOwnStocks(ns) && !ns.stock.has4SDataTIXAPI() && tickCounter < tickMax) {
            tickCounter++;
            ns.print(`Not ready for market, tick is ${tickCounter} / ${tickMax}`);
            await ns.stock.nextUpdate();
            continue;
        }
        let stockHistoryData = getStockHistory(ns);

        symbols.forEach(symbol => {
            buyLongIfAppropriate(ns, symbol, stockHistoryData[symbol]?.min || -1, stockHistoryData[symbol]?.max || -1);    
            buyShortIfAppropriate(ns, symbol, stockHistoryData[symbol]?.min || -1, stockHistoryData[symbol]?.max || -1);            
            sellLongIfAppropriate(ns, symbol, stockHistoryData[symbol]?.min || 0, stockHistoryData[symbol]?.max || Infinity);  
            sellShortIfAppropriate(ns, symbol, stockHistoryData[symbol]?.min || 0, stockHistoryData[symbol]?.max || Infinity);
        });
        await ns.stock.nextUpdate();
    }
}

/** @param {NS} ns */
function buyLongIfAppropriate(ns, symbol, min, max) {
    if (!getConfig(ns)[CONFIG_BUY_STOCKS]) return;
    // Not enough potential profit in spread
    if ((max - min) * ns.stock.getMaxShares(symbol) < minPotentialProfit(ns)) return;
    const askPrice = ns.stock.getAskPrice(symbol)

    const availableMoney = availableSpendingMoney(ns, .5);
    if (availableMoney < 1_000_000) return;
    const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
    const sharesICanBuy = Math.min(Math.floor(availableMoney / askPrice), ns.stock.getMaxShares(symbol) - sharesLong);
    // Not enough potential profit given current monies
    if ((sharesICanBuy * max * .9) - (sharesICanBuy * askPrice) < minPotentialProfit(ns)) return;
    // Don't buy if we know it's more likely to decrease than increase
    if (ns.stock.has4SDataTIXAPI() && ns.stock.getForecast(symbol) < .5) return;
    ns.stock.buyStock(symbol, sharesICanBuy);
}

/** @param {NS} ns */
function sellLongIfAppropriate(ns, symbol, min, max) {
    const bidPrice = ns.stock.getBidPrice(symbol);
    const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
    if (sharesLong === 0) return;
    // Don't sell if we know it's more likely to increase than decrease
    if (ns.stock.has4SDataTIXAPI() && ns.stock.getForecast(symbol) > .5) return;
    // Don't sell if we haven't made enough profit
    if (getSingleStockSellValue(ns, symbol) - (sharesLong * avgLongPrice) < (sharesLong * avgLongPrice) * .2) return;
    ns.stock.sellStock(symbol, sharesLong);    
}

/** @param {NS} ns */
function buyShortIfAppropriate(ns, symbol, min, max) {
    if (!getConfig(ns)[CONFIG_BUY_STOCKS]) return;
    // if (!ns.stock.has4SDataTIXAPI()) return;
    // Not enough potential profit in spread
    if ((max - min) * ns.stock.getMaxShares(symbol) < minPotentialProfit(ns)) return;
    const bidPrice = ns.stock.getBidPrice(symbol)

    const availableMoney = availableSpendingMoney(ns, .5);
    if (availableMoney < 1_000_000) return;
    const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
    const sharesICanBuy = Math.min(Math.floor(availableMoney / bidPrice), ns.stock.getMaxShares(symbol) - sharesShort);
    // Not enough potential profit given current monies
    if ((sharesICanBuy * bidPrice) - (sharesICanBuy * min * 1.1) < minPotentialProfit(ns)) return;
    // Don't buy if we know it's more likely to increase than decrease
    if (ns.stock.has4SDataTIXAPI() && ns.stock.getForecast(symbol) > .5) return;
    ns.stock.buyShort(symbol, sharesICanBuy);
}

/** @param {NS} ns */
function sellShortIfAppropriate(ns, symbol, min, max) {
    const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
    if (sharesShort === 0) return;
    // Don't sell if we know it's more likely to decrease than increase
    if (ns.stock.has4SDataTIXAPI() && ns.stock.getForecast(symbol) < .5) return;
    // Don't sell if we haven't made enough profit
    if (getSingleStockSellValue(ns, symbol) - (sharesShort * avgShortPrice) < (sharesShort * avgShortPrice) * .2) return;
    ns.stock.sellShort(symbol, sharesShort);    
}


/** @param {NS} ns */
function minPotentialProfit(ns) {
    return Math.max(getStockCommission(ns) * 20, moneyHeldIncludingStocks(ns) * .1);
}