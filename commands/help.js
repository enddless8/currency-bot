const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { version } = require('../package.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Commands and etc.'),

  async execute(interaction) {
    let title = '💰 CurrencyBot βeta'
    let description = `\
This bot can convert currencies from your messages.

**My commands:**
• </convert:1129484010402369546> - convert from 1st currency to 2nd currency
`

    let embed = new EmbedBuilder()
      .setColor(0xe0bd21)
      .setTitle(title)
      .setDescription(description)
      .setFooter({text: `v${version}`})

    await interaction.reply({embeds: [embed]}).catch((e) => {console.error(e)})
  },
}