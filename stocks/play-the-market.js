import {stockPriceFileName, stockFlagsFileName, purchaseWseIfNeeded, purchaseTIXAPIAccessIfNeeded, purchase4sTIXAPIAccessIfNeeded} from "stocks/helpers"

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('sleep');
	ns.disableLog('getServerMoneyAvailable');
	await purchaseWseIfNeeded(ns);
	await purchaseTIXAPIAccessIfNeeded(ns);

	var buyPriceMultiplier = .25;

	while (true) {
		purchase4sTIXAPIAccessIfNeeded(ns);
		var stockPriceData = JSON.parse(ns.read(stockPriceFileName));	
		var flagsData = JSON.parse(ns.read(stockFlagsFileName));
		Object.keys(stockPriceData).forEach(stockSymbol => {
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
					var sharesToBuy = calculateSharesToBuy(ns, stockSymbol, askPrice);
					if (sharesToBuy === 0) return;
					ns.stock.buyStock(stockSymbol, sharesToBuy);
				} else if (minShortPurchasePrice < bidPrice && forcastIsFavorable(ns, stockSymbol, "Short")) {
					var sharesToBuy = calculateSharesToBuy(ns, stockSymbol, bidPrice);
					if (sharesToBuy === 0) return;
					ns.stock.buyShort(stockSymbol, sharesToBuy);
				}
			}
		});
		
		await ns.sleep(60000);
	}
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
function calculateSharesToBuy(ns, stockSymbol, buyPrice) {
	const transactionFee = 100_000;
	var maxShares = ns.stock.getMaxShares(stockSymbol);
	var minShares = maxShares * .1;
	var myMoney = ns.getServerMoneyAvailable("home") - transactionFee * 2;
	var sharesToBuy = 0;
	while (sharesToBuy * buyPrice <= myMoney && sharesToBuy <= maxShares) {
		sharesToBuy++;
	}
	
	if (sharesToBuy >= minShares) {
		return sharesToBuy;
	}
	else {
		return 0;
	}
}