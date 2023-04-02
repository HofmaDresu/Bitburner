import {stockPriceFileName, stockFlagsFileName, purchaseWseIfNeeded, purchaseTIXAPIAccessIfNeeded, purchase4sTIXAPIAccessIfNeeded, stockToServers} from "stocks/helpers"
import { getHackableServers } from "helpers";
const transactionFee = 100_000;
const PROFIT_MARGIN = 1.4;

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

	while (true) {
		//TODO: re-enable
		//purchase4sTIXAPIAccessIfNeeded(ns);
		var stockPriceData = JSON.parse(ns.read(stockPriceFileName));	
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
				if (longShares && saleIsProfittable(ns, stockSymbol, longShares, "Long", longPx) && sellForcastIsFavorable(ns, stockSymbol, "Long") && !wouldRebuy(ns, stockSymbol, longShares, "Long", askPrice, stockPriceData[stockSymbol].maxPrice)) {
					ns.stock.sellStock(stockSymbol, longShares);
				}
				if (shortShares && saleIsProfittable(ns, stockSymbol, shortShares, "Short", shortPx) && sellForcastIsFavorable(ns, stockSymbol, "Short") && !wouldRebuy(ns, stockSymbol, shortShares, "Short", bidPrice, stockPriceData[stockSymbol].minPrice)) {
					ns.stock.sellShort(stockSymbol, shortShares);
				}	
			} else {
				// We have none of this stock
				const shouldLookAtLong = stockPriceData[stockSymbol].maxPrice - askPrice > bidPrice - stockPriceData[stockSymbol].minPrice;

				if (shouldLookAtLong) {
					if (maxLongPurchasePrice > askPrice && buyForcastIsFavorable(ns, stockSymbol, "Long")) {
						var sharesToBuy = calculateLongSharesToBuy(ns, stockSymbol, askPrice, stockPriceData[stockSymbol].maxPrice);
						if (sharesToBuy === 0) return;
						ns.print(`maxDiff: ${maxPriceDiffSeen.toLocaleString('en-US')}, maxLongPurchasePrice: ${maxLongPurchasePrice.toLocaleString('en-US')}, askPrice: ${askPrice.toLocaleString('en-US')}`);
						ns.stock.buyStock(stockSymbol, sharesToBuy);
					}
				} else {
					if (minShortPurchasePrice < bidPrice && buyForcastIsFavorable(ns, stockSymbol, "Short")) {
						var sharesToBuy = calculateShortSharesToBuy(ns, stockSymbol, bidPrice, stockPriceData[stockSymbol].minPrice);
						if (sharesToBuy === 0) return;
						ns.print(`maxDiff: ${maxPriceDiffSeen.toLocaleString('en-US')}, minShortPurchasePrice: ${minShortPurchasePrice.toLocaleString('en-US')}, bidPrice: ${bidPrice.toLocaleString('en-US')}`);
						ns.stock.buyShort(stockSymbol, sharesToBuy);
					}
				}
			}
		});
		
		await ns.sleep(6000);
	}
}

/** @param {NS} ns */
function wouldRebuy(ns, stockSymbol, shares, position, purchasePrice, minMaxPrice) {
	const saleGain = ns.stock.getSaleGain(stockSymbol, shares, position);
	if (position == "Long") {
		const sharesToBuy = calculateLongSharesToBuy(ns, stockSymbol, purchasePrice, minMaxPrice, saleGain);
		return sharesToBuy > 0;
	}
	if (position == "Short") {
		const sharesToBuy = calculateShortSharesToBuy(ns, stockSymbol, purchasePrice, minMaxPrice, saleGain);
		return sharesToBuy > 0;
	}	
}


/** @param {NS} ns */
function saleIsProfittable(ns, stockSymbol, shares, position, px) {
	const saleGain = ns.stock.getSaleGain(stockSymbol, shares, position);
	const sufficientProfit = saleGain > (PROFIT_MARGIN * px * shares);
	return sufficientProfit;
}

function stockHasHackableServerComparator(ns, b) {
	const hackableServers = getHackableServers(ns, "home");
	return stockToServers[b].some(server => hackableServers.some(hs => hs === server)) ? 1 : 0;
}

/** @param {NS} ns */
function buyForcastIsFavorable(ns, stockSymbol, position) {
	if (ns.stock.has4SDataTIXAPI()) {
		const forcast = ns.stock.getForecast(stockSymbol);
		return position === "Long" && forcast > .6 || position === "Short" && forcast < .4;
	} else {
		return true;
	}
}

/** @param {NS} ns */
function sellForcastIsFavorable(ns, stockSymbol, position) {
	if (ns.stock.has4SDataTIXAPI()) {
		const forcast = ns.stock.getForecast(stockSymbol);
		return position === "Long" && forcast < .4 || position === "Short" && forcast > .6;
	} else {
		return true;
	}
}

/** @param {NS} ns */
function calculateLongSharesToBuy(ns, stockSymbol, buyPrice, maxPriceSeen, additionalMoney = 0) {
	if (!canPurchase(ns)) {
		return 0;
	}
	var maxShares = ns.stock.getMaxShares(stockSymbol);
	var myMoney = (ns.getServerMoneyAvailable("home") + additionalMoney) * .9;
	var sharesToBuy = 0;
	while (ns.stock.getPurchaseCost(stockSymbol, sharesToBuy + 1, "Long") < myMoney && sharesToBuy <= maxShares) {
		sharesToBuy++;
	}
	const moneyToBuy = ns.stock.getPurchaseCost(stockSymbol, sharesToBuy, "Long");
	const maxSaleMoney = sharesToBuy * maxPriceSeen;
	const potentialProfit = maxSaleMoney - moneyToBuy - transactionFee;
	if (potentialProfit > moneyToBuy * PROFIT_MARGIN) {
		return sharesToBuy;
	} else {
		return 0;
	}
}

/** @param {NS} ns */
function calculateShortSharesToBuy(ns, stockSymbol, buyPrice, minPriceSeen, additionalMoney = 0) {
	if (!canPurchase(ns)) {
		return 0;
	}
	var maxShares = ns.stock.getMaxShares(stockSymbol);
	var myMoney = (ns.getServerMoneyAvailable("home") + additionalMoney) * .9;
	var sharesToBuy = 0;
	while (ns.stock.getPurchaseCost(stockSymbol, sharesToBuy + 1, "Short") < myMoney && sharesToBuy <= maxShares) {
		sharesToBuy++;
	}
	const moneyToBuy = ns.stock.getPurchaseCost(stockSymbol, sharesToBuy, "Short");
	const minSaleMoney = sharesToBuy * minPriceSeen;
	const potentialProfit = moneyToBuy + (moneyToBuy - minSaleMoney - transactionFee);
	//ns.print(`stockSymbol: ${stockSymbol}, sharesToBuy: ${sharesToBuy}, moneyToBuy: ${moneyToBuy.toLocaleString('en-US')}, minSaleMoney: ${minSaleMoney.toLocaleString('en-US')}, potentialProfit: ${potentialProfit.toLocaleString('en-US')}`);
	if (buyPrice > 10 * minPriceSeen && potentialProfit > moneyToBuy * PROFIT_MARGIN) {
		return sharesToBuy;
	} else {
		return 0;
	}
}

function canPurchase(ns) {
	var flagsData = JSON.parse(ns.read(stockFlagsFileName));
	return flagsData.allowPurchases && ns.scriptRunning("/automation/script-starter.js", "home")
}