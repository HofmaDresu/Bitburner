import {stockPriceFileName, stockFlagsFileName, purchaseWseIfNeeded, purchaseTIXAPIAccessIfNeeded, purchase4sTIXAPIAccessIfNeeded, stockToServers} from "stocks/helpers"
import { getHackableServers } from "helpers";
const transactionFee = 100_000;
const PROFIT_MARGIN = 1.2;

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
				if (shouldSell(ns, stockSymbol, longShares, "Long", longPx, askPrice, stockPriceData[stockSymbol].maxPrice, maxLongPurchasePrice)) {
					ns.stock.sellStock(stockSymbol, longShares);
				}
				if (shouldSell(ns, stockSymbol, shortShares, "Short", shortPx, bidPrice, stockPriceData[stockSymbol].minPrice, minShortPurchasePrice)) {
					ns.stock.sellShort(stockSymbol, shortShares);
				}	
			} 
			const shouldLookAtLong = stockPriceData[stockSymbol].maxPrice - askPrice > bidPrice - stockPriceData[stockSymbol].minPrice;

			if (shouldLookAtLong) {
				var sharesToBuy = calculateLongSharesToBuy(ns, stockSymbol, askPrice, stockPriceData[stockSymbol].maxPrice, maxLongPurchasePrice);
				if (sharesToBuy === 0) return;
				ns.print(`maxDiff: ${maxPriceDiffSeen.toLocaleString('en-US')}, maxLongPurchasePrice: ${maxLongPurchasePrice.toLocaleString('en-US')}, askPrice: ${askPrice.toLocaleString('en-US')}`);
				ns.stock.buyStock(stockSymbol, sharesToBuy);
			} else {
				var sharesToBuy = calculateShortSharesToBuy(ns, stockSymbol, bidPrice, stockPriceData[stockSymbol].minPrice, minShortPurchasePrice);
				if (sharesToBuy === 0) return;
				ns.print(`maxDiff: ${maxPriceDiffSeen.toLocaleString('en-US')}, minShortPurchasePrice: ${minShortPurchasePrice.toLocaleString('en-US')}, bidPrice: ${bidPrice.toLocaleString('en-US')}`);
				ns.stock.buyShort(stockSymbol, sharesToBuy);
			}
		});
		
		await ns.sleep(6000);
	}
}

/** @param {NS} ns */
function shouldSell(ns, stockSymbol, shares, position, px, purchasePrice, minMaxPrice, minMaxPurchasePrice) {
	return shares && saleIsProfittable(ns, stockSymbol, shares, position, px) && sellForcastIsFavorable(ns, stockSymbol, position) && !wouldRebuy(ns, stockSymbol, shares, position, purchasePrice, minMaxPrice, minMaxPurchasePrice)
}

/** @param {NS} ns */
function wouldRebuy(ns, stockSymbol, shares, position, purchasePrice, minMaxPrice, minMaxPurchasePrice) {
	const saleGain = ns.stock.getSaleGain(stockSymbol, shares, position);
	if (position == "Long") {
		const sharesToBuy = calculateLongSharesToBuy(ns, stockSymbol, purchasePrice, minMaxPrice, minMaxPurchasePrice, saleGain);
		return sharesToBuy > 0;
	}
	if (position == "Short") {
		const sharesToBuy = calculateShortSharesToBuy(ns, stockSymbol, purchasePrice, minMaxPrice, minMaxPurchasePrice, saleGain);
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
function calculateLongSharesToBuy(ns, stockSymbol, buyPrice, maxPriceSeen, maxPurchasePrice, additionalMoney = 0) {
	if (!canPurchase(ns) || buyPrice === 0 || maxPurchasePrice < buyPrice || !buyForcastIsFavorable(ns, stockSymbol, "Long")) {
		return 0;
	}
	var maxShares = ns.stock.getMaxShares(stockSymbol);
	var sharesToBuy = 0;

	const [longShares, _longPx, _shortShares, _shortPx] = ns.stock.getPosition(stockSymbol);
	// Don't count shares in net worth if we're about to buy more
	const sharesInNetWorth = additionalMoney !== 0 ? longShares : 0;
	
	while (canAffordShares(ns, stockSymbol, sharesToBuy + 1, "Long", additionalMoney) && isSmallEnoughPortionOfNetWorth(ns, stockSymbol, sharesToBuy + sharesInNetWorth + 1, "Long", additionalMoney) && sharesToBuy <= maxShares) {
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
function calculateShortSharesToBuy(ns, stockSymbol, buyPrice, minPriceSeen, minPurchasePrice, additionalMoney = 0) {
	if (!canPurchase(ns) || buyPrice === 0 || minPurchasePrice > buyPrice || !buyForcastIsFavorable(ns, stockSymbol, "Short")) {
		return 0;
	}
	var maxShares = ns.stock.getMaxShares(stockSymbol);
	var sharesToBuy = 0;
	const [_longShares, _longPx, shortShares, _shortPx] = ns.stock.getPosition(stockSymbol);
	// Don't count shares in net worth if we're about to buy more
	const sharesInNetWorth = additionalMoney !== 0 ? shortShares : 0;
	while (canAffordShares(ns, stockSymbol, sharesToBuy + 1, "Short", additionalMoney) && isSmallEnoughPortionOfNetWorth(ns, stockSymbol, sharesToBuy + sharesInNetWorth + 1, "Short", additionalMoney) && sharesToBuy <= maxShares) {
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

/** @param {NS} ns */
function canAffordShares(ns, stockSymbol, shares, position, additionalMoney) {
	const money = (ns.getServerMoneyAvailable("home") + additionalMoney) * .5; 
	const cost = ns.stock.getPurchaseCost(stockSymbol, shares, position);
	return money > cost;
}

/** @param {NS} ns */
function isSmallEnoughPortionOfNetWorth(ns, stockSymbol, shares, position, additionalMoney) {
	//TODO: Upgrade for multiple purchases of same stock
	const money = (ns.getServerMoneyAvailable("home") + additionalMoney);
	const stockValue = Object.keys(stockToServers).map(stockSymbol => {
		const [longShares, _longPx, shortShares, _shortPx] = ns.stock.getPosition(stockSymbol);
		let value = 0;
		
		value += ns.stock.getSaleGain(stockSymbol, longShares, "Long");
		value += ns.stock.getSaleGain(stockSymbol, shortShares, "Short");
		return value;
	}).reduce((prev, curr) => prev += curr, 0);
	const cost = ns.stock.getPurchaseCost(stockSymbol, shares, position);
	return cost < (money + stockValue) * .25;
}