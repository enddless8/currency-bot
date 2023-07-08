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

    if (i === "lei" || i === "лей" || i === 'леи' || i === 'ron') {
      currency = 'RON'
      break
    }

    if (i.includes("manat") || i === "azn" || i.includes("манат") || i === 'ман' || i === 'ман.' || i === "₼") {
      currency = 'AZN'
      break
    }

    if (i.includes("dirham") || i === "mad" || i.includes("дирхам") || i === "dh") {
      currency = 'MAD'
      break
    }

    if (i.includes("lira") || i.includes("лир") || i === "tl" || i === "₺") {
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
    title = `🇺🇸 ${amount} USD ($)`

    let usdeur = await convert(amount, "USD", "EUR")
    let usdrub = await convert(amount, "USD", "RUB")
    let usdron = await convert(amount, "USD", "RON")
    let usdazn = await convert(amount, "USD", "AZN")
    let usdmad = await convert(amount, "USD", "MAD")
    let usdtry = await convert(amount, "USD", "TRY")

    description = `🇪🇺 **${usdeur}** EUR (€)\n🇷🇺 **${usdrub}** RUB (₽)\n🇷🇴 **${usdron}** RON (lei)\n🇦🇿 **${usdazn}** AZN (₼)\n🇲🇦 **${usdmad}** MAD (DH)\n🇹🇷 **${usdtry}** TRY (₺)`
  }

  if (currency === 'EUR') {
    title = `🇪🇺 ${amount} EUR (€)`

    let eurusd = await convert(amount, "EUR", "USD")
    let eurrub = await convert(amount, "EUR", "RUB")
    let eurron = await convert(amount, "EUR", "RON")
    let eurazn = await convert(amount, "EUR", "AZN")
    let eurmad = await convert(amount, "EUR", "MAD")
    let eurtry = await convert(amount, "EUR", "TRY")

    description = `🇺🇸 **${eurusd}** USD ($)\n🇷🇺 **${eurrub}** RUB (₽)\n🇷🇴 **${eurron}** RON (lei)\n🇦🇿 **${eurazn}** AZN (₼)\n🇲🇦 **${eurmad}** MAD (DH)\n🇹🇷 **${eurtry}** TRY (₺)`
  }

  if (currency === 'RUB') {
    title = `🇷🇺 ${amount} RUB (₽)`

    let rubusd = await convert(amount, "RUB", "USD")
    let rubeur = await convert(amount, "RUB", "EUR")
    let rubron = await convert(amount, "RUB", "RON")
    let rubazn = await convert(amount, "RUB", "AZN")
    let rubmad = await convert(amount, "RUB", "MAD")
    let rubtry = await convert(amount, "RUB", "TRY")

    description = `🇺🇸 **${rubusd}** USD ($)\n🇪🇺 **${rubeur}** EUR (€)\n🇷🇴 **${rubron}** RON (lei)\n🇦🇿 **${rubazn}** AZN (₼)\n🇲🇦 **${rubmad}** MAD (DH)\n🇹🇷 **${rubtry}** TRY (₺)`
  }

  if (currency === 'RON') {
    title = `🇷🇴 ${amount} RON (lei)`

    let ronusd = await convert(amount, "RON", "USD")
    let roneur = await convert(amount, "RON", "EUR")
    let ronrub = await convert(amount, "RON", "RUB")
    let ronazn = await convert(amount, "RON", "AZN")
    let ronmad = await convert(amount, "RON", "MAD")
    let rontry = await convert(amount, "RON", "TRY")

    description = `🇺🇸 **${ronusd}** USD ($)\n🇪🇺 **${roneur}** EUR (€)\n🇷🇺 **${ronrub}** RUB (₽)\n🇦🇿 **${ronazn}** AZN (₼)\n🇲🇦 **${ronmad}** MAD (DH)\n🇹🇷 **${rontry}** TRY (₺)`
  }

  if (currency === "AZN") {
    title = `🇦🇿 ${amount} AZN (₼)`

    let aznusd = await convert(amount, "AZN", "USD")
    let azneur = await convert(amount, "AZN", "EUR")
    let aznrub = await convert(amount, "AZN", "RUB")
    let aznron = await convert(amount, "AZN", "RON")
    let aznmad = await convert(amount, "AZN", "MAD")
    let azntry = await convert(amount, "AZN", "TRY")

    description = `🇺🇸 **${aznusd}** USD ($)\n🇪🇺 **${azneur}** EUR (€)\n🇷🇺 **${aznrub}** RUB (₽)\n🇷🇴 **${aznron}** RON (lei)\n🇲🇦 **${aznmad}** MAD (DH)\n🇹🇷 **${azntry}** TRY (₺)`
  }

  if (currency === "MAD") {
    title = `🇲🇦 ${amount} MAD (DH)`

    let madusd = await convert(amount, "MAD", "USD")
    let madeur = await convert(amount, "MAD", "EUR")
    let madrub = await convert(amount, "MAD", "RUB")
    let madron = await convert(amount, "MAD", "RON")
    let madazn = await convert(amount, "MAD", "AZN")
    let madtry = await convert(amount, "MAD", "TRY")

    description = `🇺🇸 **${madusd}** USD ($)\n🇪🇺 **${madeur}** EUR (€)\n🇷🇺 **${madrub}** RUB (₽)\n🇷🇴 **${madron}** RON (lei)\n🇦🇿 **${madazn}** AZN (₼)\n🇹🇷 **${madtry}** TRY (₺)`
  }

  if (currency === "TRY") {
    title = `🇹🇷 ${amount} TRY (₺)`

    let tryusd = await convert(amount, "TRY", "USD")
    let tryeur = await convert(amount, "TRY", "EUR")
    let tryrub = await convert(amount, "TRY", "RUB")
    let tryron = await convert(amount, "TRY", "RON")
    let tryazn = await convert(amount, "TRY", "AZN")
    let trymad = await convert(amount, "TRY", "MAD")

    description = `🇺🇸 **${tryusd}** USD ($)\n🇪🇺 **${tryeur}** EUR (€)\n🇷🇺 **${tryrub}** RUB (₽)\n🇷🇴 **${tryron}** RON (lei)\n🇦🇿 **${tryazn}** AZN (₼)\n🇲🇦 **${trymad}** MAD (DH)`
  }

  let embed = new EmbedBuilder()
    .setColor(0x85BB65)
    .setTitle(title)
    .setDescription(description)

  msg.reply({embeds: [embed]}).catch((e) => {console.error(e)})
})

client.login(token)
