const fs = require('node:fs')
const path = require('node:path')
const { REST, Routes, Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js')
const { token, clientId } = require('./config.json')

const { convertAndFormat } = require('./functions/convertAndFormat.js')

const { version } = require('./package.json')

const flags = require('./dictionaries/flags.json')
const symbols = require('./dictionaries/symbols.json')

const client = new Client({ intents: [ 
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,] 
})

client.commands = new Collection()

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
const commands = []

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)

  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON())
    client.commands.set(command.data.name, command)
  } else {
    console.log(`⚠️ the command at ${filePath} is missing a required "data" or "execute" property.`)
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`⏳ started refreshing ${commands.length} application (/) commands.`)

    const data = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

    console.log(`✔️ successfully reloaded ${data.length} application (/) commands.`)
  } catch (error) {
    console.error(error)
  }
})()


client.once('ready', () => {
  console.log('')
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
  let amountToFixed = 0
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

    if (i.includes("itlira") || i === "itl") {
      currency = 'ITL'
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
      amountToFixed = amount.toFixed(2)
      break
    }
  }

  if (!currency || !amount) return

  let title = `${flags[currency]} ${amountToFixed} ${currency} (${symbols[currency]})`
  let description
  
  if (currency === 'USD') {
    let usdeur = await convertAndFormat(amount, "USD", "EUR")
    let usdrub = await convertAndFormat(amount, "USD", "RUB")
    let usdron = await convertAndFormat(amount, "USD", "RON")
    let usdazn = await convertAndFormat(amount, "USD", "AZN")
    let usdmad = await convertAndFormat(amount, "USD", "MAD")
    let usditl = await convertAndFormat(amount, "USD", "ITL")
    let usdtry = await convertAndFormat(amount, "USD", "TRY")

    description = `${usdeur}\n${usdrub}\n${usdron}\n${usdazn}\n${usdmad}\n${usditl}\n${usdtry}`
  }

  if (currency === 'EUR') {
    let eurusd = await convertAndFormat(amount, "EUR", "USD")
    let eurrub = await convertAndFormat(amount, "EUR", "RUB")
    let eurron = await convertAndFormat(amount, "EUR", "RON")
    let eurazn = await convertAndFormat(amount, "EUR", "AZN")
    let eurmad = await convertAndFormat(amount, "EUR", "MAD")
    let euritl = await convertAndFormat(amount, "EUR", "ITL")
    let eurtry = await convertAndFormat(amount, "EUR", "TRY")

    description = `${eurusd}\n${eurrub}\n${eurron}\n${eurazn}\n${eurmad}\n${euritl}\n${eurtry}`
  }

  if (currency === 'RUB') {
    let rubusd = await convertAndFormat(amount, "RUB", "USD")
    let rubeur = await convertAndFormat(amount, "RUB", "EUR")
    let rubron = await convertAndFormat(amount, "RUB", "RON")
    let rubazn = await convertAndFormat(amount, "RUB", "AZN")
    let rubmad = await convertAndFormat(amount, "RUB", "MAD")
    let rubitl = await convertAndFormat(amount, "RUB", "ITL")
    let rubtry = await convertAndFormat(amount, "RUB", "TRY")

    description = `${rubusd}\n${rubeur}\n${rubron}\n${rubazn}\n${rubmad}\n${rubitl}\n${rubtry}`
  }

  if (currency === 'RON') {
    let ronusd = await convertAndFormat(amount, "RON", "USD")
    let roneur = await convertAndFormat(amount, "RON", "EUR")
    let ronrub = await convertAndFormat(amount, "RON", "RUB")
    let ronazn = await convertAndFormat(amount, "RON", "AZN")
    let ronmad = await convertAndFormat(amount, "RON", "MAD")
    let romitl = await convertAndFormat(amount, "RON", "ITL")
    let rontry = await convertAndFormat(amount, "RON", "TRY")

    description = `${ronusd}\n${roneur}\n${ronrub}\n${ronazn}\n${ronmad}\n${ronitl}\n${rontry}`
  }

  if (currency === "AZN") {
    let aznusd = await convertAndFormat(amount, "AZN", "USD")
    let azneur = await convertAndFormat(amount, "AZN", "EUR")
    let aznrub = await convertAndFormat(amount, "AZN", "RUB")
    let aznron = await convertAndFormat(amount, "AZN", "RON")
    let aznmad = await convertAndFormat(amount, "AZN", "MAD")
    let aznitl = await convertAndFormat(amount, "RON", "ITL")
    let azntry = await convertAndFormat(amount, "AZN", "TRY")

    description = `${aznusd}\n${azneur}\n${aznrub}\n${aznron}\n${aznmad}\n${aznitl}\n${azntry}`
  }

  if (currency === "MAD") {
    let madusd = await convertAndFormat(amount, "MAD", "USD")
    let madeur = await convertAndFormat(amount, "MAD", "EUR")
    let madrub = await convertAndFormat(amount, "MAD", "RUB")
    let madron = await convertAndFormat(amount, "MAD", "RON")
    let madazn = await convertAndFormat(amount, "MAD", "AZN")
    let maditl = await convertAndFormat(amount, "RON", "ITL")
    let madtry = await convertAndFormat(amount, "MAD", "TRY")

    description = `${madusd}\n${madeur}\n${madrub}\n${madron}\n${madazn}\n${maditl}\n${madtry}`
  }

  if (currency === "ITL") {
    let itlusd = await convertAndFormat(amount, "ITL", "USD")
    let itleur = await convertAndFormat(amount, "ITL", "EUR")
    let itlrub = await convertAndFormat(amount, "ITL", "RUB")
    let itlron = await convertAndFormat(amount, "ITL", "RON")
    let itlazn = await convertAndFormat(amount, "ITL", "AZN")
    let itlmad = await convertAndFormat(amount, "ITL", "MAD")
    let itltry = await convertAndFormat(amount, "ITL", "TRY")

    description = `${itlusd}\n${itleur}\n${itlrub}\n${itlron}\n${itlazn}\n${itlmad}\n${itltry}`
  }

  if (currency === "TRY") {
    let tryusd = await convertAndFormat(amount, "TRY", "USD")
    let tryeur = await convertAndFormat(amount, "TRY", "EUR")
    let tryrub = await convertAndFormat(amount, "TRY", "RUB")
    let tryron = await convertAndFormat(amount, "TRY", "RON")
    let tryazn = await convertAndFormat(amount, "TRY", "AZN")
    let trymad = await convertAndFormat(amount, "TRY", "MAD")
    let tryitl = await convertAndFormat(amount, "RON", "ITL")

    description = `${tryusd}\n${tryeur}\n${tryrub}\n${tryron}\n${tryazn}\n${trymad}\n${tryitl}`
  }

  let embed = new EmbedBuilder()
    .setColor(0x85BB65)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp()

  msg.reply({embeds: [embed]}).catch((e) => {console.error(e)})
})


client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return

  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command :(', ephemeral: true })
    } else {
      await interaction.reply({ content: 'There was an error while executing this command :(', ephemeral: true })
    }
  }
})


client.login(token)