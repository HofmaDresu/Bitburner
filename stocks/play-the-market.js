import {stockPriceFileName, stockFlagsFileName, purchaseWseIfNeeded, purchaseTIXAPIAccessIfNeeded, purchase4sTIXAPIAccessIfNeeded, stockToServers} from "stocks/helpers"
import { getHackableServers } from "helpers";

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('sleep');
	ns.disableLog('getServerMoneyAvailable');
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
				if (longShares && ns.stock.getSaleGain(stockSymbol, longShares, "Long") > 1.2 * longPx * longShares) {
					ns.stock.sellStock(stockSymbol, longShares);
				}
				if (shortShares && ns.stock.getSaleGain(stockSymbol, shortShares, "Short") > 1.2 * shortPx * shortShares) {
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
		
		await ns.sleep(60000);
	}
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
	const transactionFee = 100_000;
	var maxShares = ns.stock.getMaxShares(stockSymbol);
	var myMoney = ns.getServerMoneyAvailable("home") * .9 - transactionFee;
	var sharesToBuy = 0;
	while (sharesToBuy * buyPrice < myMoney && sharesToBuy <= maxShares) {
		sharesToBuy++;
	}
	const moneyToBuy = sharesToBuy * buyPrice;
	const maxSaleMoney = sharesToBuy * maxPriceSeen;
	if (maxSaleMoney - moneyToBuy > 2 * transactionFee && maxSaleMoney - moneyToBuy > moneyToBuy * 1.2) {
		return sharesToBuy;
	} else {
		return 0;
	}
}

/** @param {NS} ns */
function calculateShortSharesToBuy(ns, stockSymbol, buyPrice, minPriceSeen) {
	const transactionFee = 100_000;
	var maxShares = ns.stock.getMaxShares(stockSymbol);
	var myMoney = ns.getServerMoneyAvailable("home") * .9 - transactionFee;
	var sharesToBuy = 0;
	while (sharesToBuy * buyPrice < myMoney && sharesToBuy <= maxShares) {
		sharesToBuy++;
	}
	const moneyToBuy = sharesToBuy * buyPrice;
	const minSaleMoney = sharesToBuy * minPriceSeen;
	if (moneyToBuy - minSaleMoney > 2 * transactionFee && moneyToBuy - minSaleMoney > moneyToBuy * .2) {
		return sharesToBuy;
	} else {
		return 0;
	}
}