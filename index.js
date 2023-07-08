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

    if (i.includes("lira") || i === "₺") {
      currency = 'TRY'
      break
    }

    if (i.includes("manat") || i === "azn" || i.includes("манат") || i === 'ман' || i === 'ман.' || i === "₼") {
      currency = 'AZN'
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

    let usdeur = await convert(amount, "USD", "EUR")
    let usdrub = await convert(amount, "USD", "RUB")
    let usdron = await convert(amount, "USD", "RON")
    let usdazn = await convert(amount, "USD", "AZN")
    let usdtry = await convert(amount, "USD", "TRY")

    description = `🇪🇺 **${usdeur}** €\n🇷🇺 **${usdrub}** ₽\n🇷🇴 **${usdron}** lei\n🇦🇿 **${usdazn}** ₼\n🇹🇷 **${usdtry}** ₺`
  }

  if (currency === 'EUR') {
    title = `🇪🇺 ${amount} €`

    let eurusd = await convert(amount, "EUR", "USD")
    let eurrub = await convert(amount, "EUR", "RUB")
    let eurron = await convert(amount, "EUR", "RON")
    let eurazn = await convert(amount, "EUR", "AZN")
    let eurtry = await convert(amount, "EUR", "TRY")

    description = `🇺🇸 **${eurusd}** $\n🇷🇺 **${eurrub}** ₽\n🇷🇴 **${eurron}** lei\n🇦🇿 **${eurazn}** ₼\n🇹🇷 **${eurtry}** ₺`
  }

  if (currency === 'RUB') {
    title = `🇷🇺 ${amount} ₽`

    let rubusd = await convert(amount, "RUB", "USD")
    let rubeur = await convert(amount, "RUB", "EUR")
    let rubron = await convert(amount, "RUB", "RON")
    let rubazn = await convert(amount, "RUB", "AZN")
    let rubtry = await convert(amount, "RUB", "TRY")

    description = `🇺🇸 **${rubusd}** $\n🇪🇺 **${rubeur}** €\n🇷🇴 **${rubron}** lei\n🇦🇿 **${rubazn}** ₼\n🇹🇷 **${rubtry}** ₺`
  }

  if (currency === 'RON') {
    title = `🇷🇴 ${amount} lei`

    let ronusd = await convert(amount, "RON", "USD")
    let roneur = await convert(amount, "RON", "EUR")
    let ronrub = await convert(amount, "RON", "RUB")
    let ronazn = await convert(amount, "RON", "AZN")
    let rontry = await convert(amount, "RON", "TRY")

    description = `🇺🇸 **${ronusd}** $\n🇪🇺 **${roneur}** €\n🇷🇺 **${ronrub}** ₽\n🇦🇿 **${ronazn}** ₼\n🇹🇷 **${rontry}** ₺`
  }

  if (currency === "TRY") {
    title = `🇹🇷 ${amount} ₺`

    let tryusd = await convert(amount, "TRY", "USD")
    let tryeur = await convert(amount, "TRY", "EUR")
    let tryrub = await convert(amount, "TRY", "RUB")
    let tryazn = await convert(amount, "TRY", "AZN")
    let tryron = await convert(amount, "TRY", "RON")

    description = `🇺🇸 **${tryusd}** $\n🇪🇺 **${tryeur}** €\n🇷🇺 **${tryrub}** ₽\n🇷🇴 **${tryron}** lei\n🇦🇿 **${tryazn}** ₼`
  }

  if (currency === "AZN") {
    title = `🇦🇿 ${amount} ₼`

    let aznusd = await convert(amount, "AZN", "USD")
    let azneur = await convert(amount, "AZN", "EUR")
    let aznrub = await convert(amount, "AZN", "RUB")
    let aznron = await convert(amount, "AZN", "RON")
    let azntry = await convert(amount, "AZN", "TRY")

    description = `🇺🇸 **${aznusd}** $\n🇪🇺 **${azneur}** €\n🇷🇺 **${aznrub}** ₽\n🇷🇴 **${aznron}** lei\n🇹🇷 **${azntry}** ₺`
  }

  let embed = new EmbedBuilder()
    .setColor(0x85BB65)
    .setTitle(title)
    .setDescription(description)

  msg.reply({embeds: [embed]}).catch((e) => {console.error(e)})
})

client.login(token)
