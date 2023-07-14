const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { convert } = require('../functions/convert.js')

const flags = require('../dictionaries/flags.json')
const symbols = require('../dictionaries/symbols.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('convert')
    .setDescription('Convert from 1st currency to 2nd currency')
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('Amount to convert')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('from')
        .setDescription('Currency to convert from')
        .setRequired(true)
        .addChoices(
          { name: '🇺🇸 USD ($)', value: 'USD' },
          { name: '🇪🇺 EUR (€)', value: 'EUR' },
          { name: '🇷🇺 RUB (₽)', value: 'RUB' },
          { name: '🇷🇴 RON (lei)', value: 'RON' },
          { name: '🇦🇿 AZN (₼)', value: 'AZN' },
          { name: '🇲🇦 MAD (RH)', value: 'MAD' },
          { name: '🇮🇹 ITL (Lit)', value: 'ITL' },
          { name: '🇹🇷 TRY (₺)', value: 'TRY' },
        ))
    .addStringOption(option =>
      option.setName('to')
        .setDescription('Currency to convert to')
        .setRequired(true)
        .addChoices(
          { name: '🇺🇸 USD ($)', value: 'USD' },
          { name: '🇪🇺 EUR (€)', value: 'EUR' },
          { name: '🇷🇺 RUB (₽)', value: 'RUB' },
          { name: '🇷🇴 RON (lei)', value: 'RON' },
          { name: '🇦🇿 AZN (₼)', value: 'AZN' },
          { name: '🇲🇦 MAD (RH)', value: 'MAD' },
          { name: '🇮🇹 ITL (Lit)', value: 'ITL' },
          { name: '🇹🇷 TRY (₺)', value: 'TRY' },
        )),

  async execute(interaction) {
    let amount = interaction.options.getInteger('amount')
    let currencyFrom = interaction.options.getString('from')
    let currencyTo = interaction.options.getString('to')

    let embedEqual = new EmbedBuilder()
      .setColor(0x0080ff)
      .setTitle(`ℹ️ You can't convert the same currency`)

    if (currencyFrom === currencyTo) {
      await interaction.reply({embeds: [embedEqual], ephemeral: true}).catch((e) => {console.error(e)})
      return
    }

    let convertedAmount = await convert(amount, currencyFrom, currencyTo)

    let title = `${flags[currencyTo]} ${convertedAmount} ${currencyTo} (${symbols[currencyTo]})`
    let description = `${flags[currencyFrom]} **${amount}** ${currencyFrom} (${symbols[currencyFrom]})`

    let embed = new EmbedBuilder()
      .setColor(0x85BB65)
      .setTitle(title)
      .setDescription(description)
      .setTimestamp()

    await interaction.reply({embeds: [embed]}).catch((e) => {console.error(e)})
  },
}