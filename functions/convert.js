const CC = require('currency-converter-lt')

let currencyConverter = new CC()

async function convert(amount, currency1, currency2) {
    let result = await currencyConverter.amount(amount).from(currency1).to(currency2).convert()
    return result.toFixed(2)
}

module.exports.convert = convert