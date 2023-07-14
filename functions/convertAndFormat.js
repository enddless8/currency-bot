const { convert } = require('./convert.js')

const flags = require('../dictionaries/flags.json')
const symbols = require('../dictionaries/symbols.json')

async function convertAndFormat(amount, currency1, currency2) {
  let convertion = await convert(amount, currency1, currency2)
  let result = `${flags[currency2]} **${convertion}** ${currency2} (${symbols[currency2]})`

  return result
}

module.exports.convertAndFormat = convertAndFormat