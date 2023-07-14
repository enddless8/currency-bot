const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { version } = require('../package.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('changelog')
    .setDescription('Changelog of the bot'),

  async execute(interaction) {
    let title = '💰 Changelog'
    let description = `\
**v0.1.0 initial version**
• automatic convertion of currencies from messages
• added USD, EUR, RUB, RON, TRY

**v0.2.0 doordan patch**
• added AZN
• added rounding numbers

**v0.3.0 georgef patch**
• added MAD
• reworked embed looking

**v0.4.0 groucho patch**
• added ITL
• added /convert command
• added /help command
• added /changelog command
• added date in embed
`

    let embed = new EmbedBuilder()
      .setColor(0xe0bd21)
      .setTitle(title)
      .setDescription(description)
      .setFooter({text: `v${version}`})

    await interaction.reply({embeds: [embed]}).catch((e) => {console.error(e)})
  },
}