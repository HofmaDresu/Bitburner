import {stockPriceFileName, stockFlagsFileName, purchaseWseIfNeeded, purchaseTIXAPIAccessIfNeeded, purchase4sTIXAPIAccessIfNeeded, stockToServers} from "stocks/helpers"
import { getHackableServers } from "helpers";
const transactionFee = 100_000;

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('sleep');
	ns.disableLog('getServerMoneyAvailable');
	ns.disableLog('getServerMaxMoney');
	ns.disableLog('scan');
	ns.disableLog('stock.purchase4SMarketDataTixApi');
	await purchaseWseIfNeeded(ns);
	await purchaseTIXAPIAccessIfNeeded(ns);

	var buyPriceMultiplier = .25;

	while(ns.getPlayer().playtimeSinceLastAug < 60 * 60 * 1000) {
		await ns.sleep(60 * 1000);
	}

	while (true) {
		purchase4sTIXAPIAccessIfNeeded(ns);
		var stockPriceData = JSON.parse(ns.read(stockPriceFileName));	
		var flagsData = JSON.parse(ns.read(stockFlagsFileName));
		Object.keys(stockPriceData)
		.sort((a, b) => stockHasHackableServerComparator(ns, b) - stockHasHackableServerComparator(ns, a))
		.forEach(stockSymbol => {
			const [longShares, longPx, shortShares, shortPx] = ns.stock.getPosition(stockSymbol);
			var maxPriceDiffSeen = stockPriceData[stockSymbol].maxPrice - stockPriceData[stockSymbol].minPrice;
			var maxLongPurchasePrice = stockPriceData[stockSymbol].minPrice + (maxPriceDiffSeen * buyPriceMultiplier);
			var minShortPurchasePrice = stockPriceData[stockSymbol].maxPrice - (maxPriceDiffSeen * buyPriceMultiplier);
			var askPrice = ns.stock.getAskPrice(stockSymbol);
			var bidPrice = ns.stock.getBidPrice(stockSymbol);
			if (longShares || shortShares) {
				// We have some of this stock
				if (longShares && saleIsProfittable(ns, stockSymbol, longShares, "Long", longPx)) {
					ns.stock.sellStock(stockSymbol, longShares);
				}
				if (shortShares && saleIsProfittable(ns, stockSymbol, shortShares, "Short", shortPx)) {
					ns.stock.sellShort(stockSymbol, shortShares);
				}	
			} else if (flagsData.allowPurchases && ns.scriptRunning("/automation/script-starter.js", "home")) {
				// We have none of this stock
				if (maxLongPurchasePrice > askPrice && forcastIsFavorable(ns, stockSymbol, "Long")) {
					var sharesToBuy = calculateLongSharesToBuy(ns, stockSymbol, askPrice, stockPriceData[stockSymbol].maxPrice);
					if (sharesToBuy === 0) return;
					ns.stock.buyStock(stockSymbol, sharesToBuy);
				} else if (minShortPurchasePrice < bidPrice && forcastIsFavorable(ns, stockSymbol, "Short")) {
					var sharesToBuy = calculateShortSharesToBuy(ns, stockSymbol, bidPrice, stockPriceData[stockSymbol].minPrice);
					if (sharesToBuy === 0) return;
					ns.stock.buyShort(stockSymbol, sharesToBuy);
				}
			}
		});
		
		await ns.sleep(6000);
	}
}

/** @param {NS} ns */
function saleIsProfittable(ns, stockSymbol, shares, position, px) {
	const saleGain = ns.stock.getSaleGain(stockSymbol, shares, position);
	const overTransactionFee = saleGain > transactionFee;
	const sufficientProfit = saleGain > (1.2 * px * shares) - transactionFee
	return overTransactionFee && sufficientProfit;
}

function stockHasHackableServerComparator(ns, b) {
	const hackableServers = getHackableServers(ns, "home");
	return stockToServers[b].some(server => hackableServers.some(hs => hs === server)) ? 1 : 0;
}

/** @param {NS} ns */
function forcastIsFavorable(ns, stockSymbol, position) {
	if (ns.stock.has4SDataTIXAPI()) {
		const forcast = ns.stock.getForecast(stockSymbol);
		return position === "Long" && forcast > .5 || position === "Short" && forcast < .5;
	} else {
		return true;
	}
}

/** @param {NS} ns */
function calculateLongSharesToBuy(ns, stockSymbol, buyPrice, maxPriceSeen) {
	var maxShares = ns.stock.getMaxShares(stockSymbol);
	var myMoney = ns.getServerMoneyAvailable("home") * .9 - transactionFee;
	var sharesToBuy = 0;
	while (sharesToBuy * buyPrice < myMoney && sharesToBuy <= maxShares) {
		sharesToBuy++;
	}
	const moneyToBuy = sharesToBuy * buyPrice;
	const maxSaleMoney = sharesToBuy * maxPriceSeen;
	const potentialProfit = maxSaleMoney - moneyToBuy;
	if (potentialProfit > moneyToBuy * 1.2 && potentialProfit > transactionFee) {
		return sharesToBuy;
	} else {
		return 0;
	}
}

/** @param {NS} ns */
function calculateShortSharesToBuy(ns, stockSymbol, buyPrice, minPriceSeen) {
	var maxShares = ns.stock.getMaxShares(stockSymbol);
	var myMoney = ns.getServerMoneyAvailable("home") * .9 - transactionFee;
	var sharesToBuy = 0;
	while (sharesToBuy * buyPrice < myMoney && sharesToBuy <= maxShares) {
		sharesToBuy++;
	}
	const moneyToBuy = sharesToBuy * buyPrice;
	const minSaleMoney = sharesToBuy * minPriceSeen;
	const potentialProfit = moneyToBuy - minSaleMoney;
	if (buyPrice > 4 * minPriceSeen && potentialProfit > moneyToBuy * .2 && potentialProfit > transactionFee) {
		return sharesToBuy;
	} else {
		return 0;
	}
}