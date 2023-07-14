const CC = require('currency-converter-lt')

let currencyConverter = new CC()

let ratesCacheOptions = {
    isRatesCaching: true,
    ratesCacheDuration: 3600
}

async function convert(amount, currency1, currency2) {
  if (currency1 === "ITL") {
    let itlusd = amount *  0.0005684

    if (currency2 === "USD") {
      return itlusd.toFixed(2)
    }

    let result = await currencyConverter.setupRatesCache(ratesCacheOptions).amount(itlusd).from("USD").to(currency2).convert()
    return result.toFixed(2)
  }

  if (currency2 === "ITL") {
    let toUSD = await currencyConverter.setupRatesCache(ratesCacheOptions).amount(amount).from(currency1).to("USD").convert()
    let result = toUSD / 0.0005684
    return result.toFixed(2)
  }

  let result = await currencyConverter.setupRatesCache(ratesCacheOptions).amount(amount).from(currency1).to(currency2).convert()
  return result.toFixed(2)
}

module.exports.convert = convert