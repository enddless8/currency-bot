const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js')
const { token } = require('./config.json')

const { convert } = require('./functions/convert.js')

const { version } = require('./package.json')

const client = new Client({ intents: [ 
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,] 
})

client.once('ready', () => {
  console.log(`⚡ currency-bot ${version} is ready to do its job!`)
  console.log('⚡ with 💗 by vanethepain')
  console.log(`✔️ logged in as ${client.user.tag}`)

  client.user.setPresence({activities: [{type: 'WATCHING', name: 'currencies'}] })
})

client.on('messageCreate', async msg => {
  let text = msg.content.toLowerCase().replace('ё', 'е')
  let textSplit = text.split(" ")

  let prefix = text[0]
  let command = text.slice(2)

  let authorPing = `<@!${msg.author.id.toString()}>`
  let authorTag = msg.author.tag
  let authorUsername = msg.author.username
  let authorAvatar = msg.author.displayAvatarURL({dynamic: true})

  let authorColor
  try {
    authorColor = msg.member.displayHexColor
  } catch {
    authorColor = '#000000'
  }

  let getGuild = client.guilds.cache.get(msg.guild.id)

  if (msg.author.bot) return

  let currency = ''
  let amount = 0
  for (let i of textSplit.reverse()) {
    if (i.includes("dollar") || i.includes("dolar") || i.includes("doller") || i.includes("doler") || i.includes("usd") || i.includes("доллар") || i.includes("долар") || i === "усд" || i === "усд." || i === ("$")) {
      currency = 'USD'
      break
    }

    if (i.includes("euro") || i.includes("eur") || i.includes("евро") || i === ("€")) {
      currency = 'EUR'
      break
    }

    if (i.includes("ruble") || i.includes("rubble") || i.includes("rouble") || i.includes("roubble") || i.includes("bobux") || i.includes("rub") || i === ("руб") || i === ("руб.") || i.includes("рубл") || i === ("₽")) {
      currency = 'RUB'
      break
    }

    if (i === "lei" || i === "лей" || i === 'ron') {
      currency = 'RON'
      break
    }

    if (i.includes("lira") || i === "try" || i === "₺") {
      currency = 'TRY'
      break
    }
  }

  for (let i of textSplit) {
    if (!isNaN(Number(i.replace(',', '.')))) {
      amount = Number(i.replace(',', '.'))
      break
    }
  }

  if (!currency && !amount) return

  let title
  let description
  
  if (currency === 'USD') {
    title = `🇺🇸 ${amount} $`
    description = `🇪🇺 **${await convert(amount, "USD", "EUR")}** €\n🇷🇺 **${await convert(amount, "USD", "RUB")}** ₽\n🇷🇴 **${await convert(amount, "USD", "RON")}** lei\n🇹🇷 **${await convert(amount, "USD", "TRY")}** ₺`
  }

  if (currency === 'EUR') {
    title = `🇪🇺 ${amount} €`
    description = `🇺🇸 **${await convert(amount, "EUR", "USD")}** $\n🇷🇺 **${await convert(amount, "EUR", "RUB")}** ₽\n🇷🇴 **${await convert(amount, "EUR", "RON")}** lei\n🇹🇷 **${await convert(amount, "EUR", "TRY")}** ₺`
  }

  if (currency === 'RUB') {
    title = `🇷🇺 ${amount} ₽`
    description = `🇺🇸 **${await convert(amount, "RUB", "USD")}** $\n🇪🇺 **${await convert(amount, "RUB", "EUR")}** €\n🇷🇴 **${await convert(amount, "RUB", "RON")}** lei\n🇹🇷 **${await convert(amount, "RUB", "TRY")}** ₺`
  }

  if (currency === 'RON') {
    title = `🇷🇴 ${amount} lei`
    description = `🇺🇸 **${await convert(amount, "RUB", "USD")}** $\n🇪🇺 **${await convert(amount, "RUB", "EUR")}** €\n🇷🇺 **${await convert(amount, "RON", "RUB")}** ₽\n🇹🇷 **${await convert(amount, "RON", "TRY")}** ₺`
  }

  if (currency === "TRY") {
    title = `🇹🇷 ${amount} ₺`
    description = `🇺🇸 **${await convert(amount, "TRY", "USD")}** $\n🇪🇺 **${await convert(amount, "TRY", "EUR")}** €\n🇷🇺 **${await convert(amount, "TRY", "RUB")}** ₽\n🇷🇴 **${await convert(amount, "TRY", "RON")}** lei`
  }

  let embed = new EmbedBuilder()
    .setColor(0x85BB65)
    .setTitle(title)
    .setDescription(description)

  msg.reply({embeds: [embed]}).catch((e) => {console.error(e)})
})

client.login(token)
