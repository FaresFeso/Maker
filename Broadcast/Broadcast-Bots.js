
  const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const BcDB = new Database("/Json-db/Bots/BcDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")


  let Bc = tokens.get('Bc')
  if(!Bc) return;

const path = require('path');
const { readdirSync } = require("fs");
let theowner;
Bc.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client2 = new Client({intents: 32767, shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client2.commands = new Collection();
  require(`./handlers/events`)(client2);
  client2.events = new Collection();
  require(`../../events/requireBots/Broadcast-commands`)(client2);
  const rest = new REST({ version: '10' }).setToken(token);
  client2.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client2.user.id),
          { body: BcSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
    require(`../Broadcast/handlers/events`)(client2)
    require(`../Broadcast/handlers/addToken`)(client2)
    require(`../Broadcast/handlers/sendBroadcast`)(client2)
    require(`../Broadcast/handlers/setBroadcastMessage`)(client2)

  const folderPath = path.join(__dirname, 'slashcommand2');
  client2.BcSlashCommands = new Collection();
  const BcSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("Bc commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          BcSlashCommands.push(command.data.toJSON());
          client2.BcSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'commands2');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/Broadcast-commands`)(client2)
require("./handlers/events")(client2)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client2.once(event.name, (...args) => event.execute(...args));
	} else {
		client2.on(event.name, (...args) => event.execute(...args));
	}
	}

client2.on('ready' , async() => {
  setInterval(async() => {
    let BroadcastTokenss = tokens.get(`Bc`)
    let thiss = BroadcastTokenss.find(br => br.token == token)
    if(thiss) {
      if(thiss.timeleft <= 0) {
        await client2.destroy();
        console.log(`${clientId} Ended`)
      }
    }
  }, 1000);
})


  client2.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client2.BcSlashCommands.get(interaction.commandName);
	    
      if (!command) {

        return;
      }
      if (command.ownersOnly === true) {
        if (owner != interaction.user.id) {
          return interaction.reply({content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true});
        }
      }
      try {

        await command.execute(interaction);
      } catch (error) {
			return
		}
    }
  } )

 









   client2.login(token)
   .catch(async(err) => {
    const filtered = Bc.filter(bo => bo != data)
			await tokens.set(`Bc` , filtered)
      console.log(`${clientId} Not working and removed `)
   });


})
