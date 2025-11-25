import { getStockHistory, canTradeStocks, getStockCommission, getSingleStockSellValue, iOwnStocks, getStockSellValue } from "stocks/helpers";
import { availableSpendingMoney, getConfig, CONFIG_BUY_STOCKS, moneyHeldIncludingStocks } from "helpers";

const mostRecentStockValues = {};

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('getServerMoneyAvailable');
    ns.ui.openTail();

    let tickCounter = 0;
    // 20 minutes, but because each tick is 4-6 seconds it's 80-120 in-game minutes
    const ticksToStartLong = 20 * 60;
    const ticksToStartShort = ticksToStartLong * 3;
    while (!canTradeStocks(ns)) {
        await ns.sleep(6_000);
        tickCounter++;
    }

    const symbols = ns.stock.getSymbols();
    while(true) {
        if (tickCounter < Math.max(ticksToStartLong, ticksToStartShort)) {            
            tickCounter++;
        }
        if (!iOwnStocks(ns) && !ns.stock.has4SDataTIXAPI() && tickCounter < ticksToStartLong) {
            ns.print(`Not ready for market, tick is ${tickCounter} / ${ticksToStartLong}`);
            await ns.stock.nextUpdate();
            continue;
        }
        let stockHistoryData = getStockHistory(ns);

        symbols.forEach(symbol => {     
            sellLongIfAppropriate(ns, symbol, stockHistoryData[symbol]?.min || 0, stockHistoryData[symbol]?.max || Infinity);
            cutLongLosses(ns, symbol);
            sellShortIfAppropriate(ns, symbol, stockHistoryData[symbol]?.min || 0, stockHistoryData[symbol]?.max || Infinity);
            cutShortLosses(ns, symbol);
        });
        // Loop from greatest diff between current and max
        symbols
            .sort((a, b) => ((stockHistoryData[b]?.max || ns.stock.getPrice(b)) - ns.stock.getPrice(b)) - ((stockHistoryData[a]?.max || ns.stock.getPrice(a)) - ns.stock.getPrice(a)))
            .forEach(symbol => {
                buyLongIfAppropriate(ns, symbol, stockHistoryData[symbol]?.min || -1, stockHistoryData[symbol]?.max || -1);
            });
        if (tickCounter >= ticksToStartShort) {
            // Loop from greatest diff between current and min
            symbols
                .sort((a, b) => (ns.stock.getPrice(b) - (stockHistoryData[b]?.min || ns.stock.getPrice(b))) - (ns.stock.getPrice(a) - (stockHistoryData[a]?.min || ns.stock.getPrice(a))))
                .forEach(symbol => {
                    buyShortIfAppropriate(ns, symbol, stockHistoryData[symbol]?.min || -1, stockHistoryData[symbol]?.max || -1);
                });
        }
            
        symbols.forEach(symbol => {    
            mostRecentStockValues[symbol] = ns.stock.getPrice(symbol);
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
    const sharesICanBuy = Math.min(Math.floor(availableMoney / askPrice), ns.stock.getMaxShares(symbol) * .40 - sharesLong);
    // Not enough potential profit given current monies
    if ((sharesICanBuy * max * .9) - (sharesICanBuy * askPrice) < minPotentialProfit(ns)) return;
    // Don't buy if we know it's more likely to decrease than increase
    if (isTrendingDown(ns, symbol)) return;
    // Don't buy if over half known value or under 1
    if (askPrice > .5 * max || askPrice < 1) return;
    // TODO: Don't buy if this would bring my exposure to > 55%
    if ((sharesICanBuy * askPrice) + (sharesLong * avgLongPrice) > .55 * getNetWorth(ns)) return;
    ns.stock.buyStock(symbol, sharesICanBuy);
}

/** @param {NS} ns */
function sellLongIfAppropriate(ns, symbol, min, max) {
    const bidPrice = ns.stock.getBidPrice(symbol);
    const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
    if (sharesLong === 0) return;
    // Don't sell if we know it's more likely to increase than decrease
    if (isTrendingUp(ns, symbol)) return;
    // Don't sell if we haven't made enough profit
    if (getSingleStockSellValue(ns, symbol) - (sharesLong * avgLongPrice) < Math.max((sharesLong * avgLongPrice) * .2, getStockCommission(ns) * 2)) return;
    ns.stock.sellStock(symbol, sharesLong);
}

/** @param {NS} ns */
function cutLongLosses(ns, symbol) {
    const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
    if (sharesLong === 0) return;
    if (getSingleStockSellValue(ns, symbol) >= (sharesLong * avgLongPrice) / 2) return;
    if (isTrendingUp(ns, symbol)) return;
    ns.print(`Cutting long losses ${getSingleStockSellValue(ns, symbol)} ${(sharesLong * avgLongPrice) / 2}`)
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
    const sharesICanBuy = Math.min(Math.floor(availableMoney / bidPrice), ns.stock.getMaxShares(symbol) * .40 - sharesShort);
    // Not enough potential profit given current monies
    if ((sharesICanBuy * bidPrice) - (sharesICanBuy * min * 1.1) < minPotentialProfit(ns)) return;
    // Don't buy if we know it's more likely to increase than decrease
    if (isTrendingUp(ns, symbol)) return;
    // Don't buy if under half known value
    if (bidPrice < .5 * max) return;
    // TODO: Don't buy if this would bring my exposure to > 55%
    if ((sharesICanBuy * bidPrice) + (sharesShort * avgShortPrice) > .55 * getNetWorth(ns)) return;
    ns.stock.buyShort(symbol, sharesICanBuy);
}

/** @param {NS} ns */
function sellShortIfAppropriate(ns, symbol, min, max) {
    const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
    if (sharesShort === 0) return;
    // Don't sell if we know it's more likely to decrease than increase
    if (isTrendingDown(ns, symbol)) return;
    // Don't sell if we haven't made enough profit
    if (getSingleStockSellValue(ns, symbol) - (sharesShort * avgShortPrice) < Math.max((sharesShort * avgShortPrice) * .2, getStockCommission(ns) * 2)) return;
    ns.stock.sellShort(symbol, sharesShort);    
}

/** @param {NS} ns */
function cutShortLosses(ns, symbol) {
    const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(symbol);
    if (sharesShort === 0) return;
    if (ns.stock.getPrice(symbol) > 1.5 * avgShortPrice) return;
    if (isTrendingDown(ns, symbol)) return;
    ns.print(`Cutting short losses`)
    ns.stock.sellShort(symbol, sharesShort);
}

/** @param {NS} ns */
function minPotentialProfit(ns) {
    return Math.max(getStockCommission(ns) * 20, moneyHeldIncludingStocks(ns) * .1);
}

/** @param {NS} ns */
function isTrendingUp(ns, symbol) {
    if (ns.stock.has4SDataTIXAPI()) {
        return ns.stock.getForecast(symbol) > .5;
    } else if (mostRecentStockValues[symbol] !== null && mostRecentStockValues[symbol] !== undefined) {
        return mostRecentStockValues[symbol] < ns.stock.getPrice(symbol);
    } else {
        return false;
    }
}

/** @param {NS} ns */
function isTrendingDown(ns, symbol) {
    if (ns.stock.has4SDataTIXAPI()) {
        return ns.stock.getForecast(symbol) < .5;
    } else if (mostRecentStockValues[symbol] !== null && mostRecentStockValues[symbol] !== undefined) {
        return mostRecentStockValues[symbol] > ns.stock.getPrice(symbol);
    } else {
        return false;
    }
}

/** @param {NS} ns */
function getNetWorth(ns) {
    return getStockSellValue(ns) + availableSpendingMoney(ns, 0);
}