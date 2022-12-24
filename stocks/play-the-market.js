import {stockPriceFileName, portfolioFileName, stockFlagsFileName, purchaseWseIfNeeded, purchaseTIXAPIAccessIfNeeded} from "/stocks/helpers.js"

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('sleep');
	await purchaseWseIfNeeded(ns);
	await purchaseTIXAPIAccessIfNeeded(ns);
	// {symbol: {amount, purchasePrice, pos}}
	var portfolioData = JSON.parse(ns.read(portfolioFileName));	

	var buyPriceMultiplier = .25;
	var sellPriceMultiplier = .20;

	while (true) {
		var stockPriceData = JSON.parse(ns.read(stockPriceFileName));	
		var flagsData = JSON.parse(ns.read(stockFlagsFileName));
		Object.keys(stockPriceData).forEach(stockSymbol => {
			var maxPriceDiffSeen = stockPriceData[stockSymbol].maxPrice - stockPriceData[stockSymbol].minPrice;
			var maxLongPurchasePrice = stockPriceData[stockSymbol].minPrice + (maxPriceDiffSeen * buyPriceMultiplier);
			var maxShortSellPrice = stockPriceData[stockSymbol].minPrice + (maxPriceDiffSeen * sellPriceMultiplier);
			var minShortPurchasePrice = stockPriceData[stockSymbol].maxPrice - (maxPriceDiffSeen * buyPriceMultiplier);
			var minLongSellPrice = stockPriceData[stockSymbol].maxPrice - (maxPriceDiffSeen * sellPriceMultiplier);
			var askPrice = ns.stock.getAskPrice(stockSymbol);
			var bidPrice = ns.stock.getBidPrice(stockSymbol);
			if (portfolioData[stockSymbol]?.amount) {
				// We have some of this stock
				var ownedData = portfolioData[stockSymbol];
				if (!ownedData?.amount) return;
				switch (ownedData.pos) {
					case "L":
						if (bidPrice > minLongSellPrice) {
							ns.stock.sellStock(stockSymbol, ownedData.amount);
							portfolioData[stockSymbol] = {
								amount: 0,
								purchasePrice: 0,
								pos: ""
							};
						}
						break;
					case "S":
						if (askPrice < maxShortSellPrice) {
							ns.stock.sellShort(stockSymbol, ownedData.amount);
							portfolioData[stockSymbol] = {
								amount: 0,
								purchasePrice: 0,
								pos: ""
							};
						}
						break
				}				
			} else if (flagsData.allowPurchases) {
				// We have none of this stock
				var forcast = ns.stock.getForecast(stockSymbol)
				if (maxLongPurchasePrice > askPrice && forcast > .5) {
					var sharesToBuy = calculateSharesForLong(ns, stockSymbol, askPrice, minLongSellPrice);
					if (sharesToBuy === 0) return;
					ns.stock.buyStock(stockSymbol, sharesToBuy);

					portfolioData[stockSymbol] = {
						amount: sharesToBuy,
						purchasePrice: askPrice,
						pos: "L"
					};
				} else if (minShortPurchasePrice < bidPrice && forcast < .5 && flagsData.allowShorts) {
					var sharesToBuy = calculateSharesForShort(ns, stockSymbol, bidPrice, maxShortSellPrice);
					if (sharesToBuy === 0) return;
					ns.stock.buyShort(stockSymbol, sharesToBuy);

					portfolioData[stockSymbol] = {
						amount: sharesToBuy,
						purchasePrice: askPrice,
						pos: "S"
					};
				}
			}
		});
		
		ns.write(portfolioFileName, JSON.stringify(portfolioData), "w");
		await ns.sleep(60000);
	}
}

function calculateSharesForLong(ns, stockSymbol, buyPrice, sellPrice) {
	const transactionFee = 100_000;
	var maxShares = ns.stock.getMaxShares(stockSymbol) * .75;
	var minShares = ns.stock.getMaxShares(stockSymbol) * .25;
	var myMoney = ns.getServerMoneyAvailable("home") * .80 - transactionFee;
	var sharesToBuy = 0;
	while (sharesToBuy * buyPrice <= myMoney && sharesToBuy <= maxShares) {
		sharesToBuy++;
	}
	
	if (((sharesToBuy * sellPrice) - (sharesToBuy * buyPrice)) > 1_000_000_000 && sharesToBuy >= minShares) {
		return sharesToBuy;
	}
	else {
		return 0;
	}
}

function calculateSharesForShort(ns, stockSymbol, buyPrice, sellPrice) {
	const transactionFee = 100_000;
	var maxShares = ns.stock.getMaxShares(stockSymbol);
	var minShares = ns.stock.getMaxShares(stockSymbol) * .5;
	var myMoney = ns.getServerMoneyAvailable("home") * .8 - transactionFee;
	var sharesToBuy = 0;
	while (sharesToBuy * buyPrice <= myMoney && sharesToBuy <= maxShares) {
		sharesToBuy++;
	}
	
	// Buy - Sell because this is shorting so math is backwards
	if (((sharesToBuy * buyPrice) - (sharesToBuy * sellPrice)) > 1_000_000_000 && sharesToBuy >= minShares) {
		return sharesToBuy;
	}
	else {
		return 0;
	}
}
