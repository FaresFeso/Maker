const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message, StringSelectMenuBuilder , PermissionsBitField , TextInputStyle , ModalBuilder, TextInputBuilder } = require("discord.js");
const { Client: Client2 } = require('discord.js-selfbot-v13');
const cooldowns1 = new Map();

const cooldowns2 = new Map();
const { parentId, probot_ids, recipientId, price } = require('./config.js');
const cooldowns = new Map();
const client = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
const { readdirSync } = require("fs")
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const path = require('node:path');
const fs = require('node:fs');
const mongodb = require('mongoose');
const ms = require("ms")
const { token , prefix , owner , mainguild , database} = require(`./config.json`)
const { Database } = require("st.db")
const tokens = new Database("tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const tier2subscriptions = new Database("/database/makers/tier2/subscriptions")
const tier3subscriptions = new Database("/database/makers/tier3/subscriptions")
const tier3subscriptionsplus = new Database("/database/makers/tier3/plus")
const statuses = new Database("/database/settingsdata/statuses")
const setting = new Database("/database/settingsdata/setting")
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices.json")
client.login(token).catch(err => console.log('❌ Token are not working'));
client.commandaliases = new Collection()

const rest = new REST({ version: '10' }).setToken(token);
module.exports = client;
//-
client.on("ready", async () => {
	let makers = tier1subscriptions.get(`tier1_subs`)   

                if(!makers) {
                  await tier1subscriptions.get(`tier1_subs` , []) 
                }             
                makers = tier1subscriptions.get(`tier1_subs`)
				let info = makers.find(a => a.guildid == mainguild)
				if(!info) {
					await tier1subscriptions.push(`tier1_subs` , {ownerid:owner[0],guildid:mainguild,timeleft:999999744})
				}
	try {
		await rest.put(
			Routes.applicationCommands(client.user.id),
			{ body: slashcommands },
		);
	} catch (error) {
		console.error(error);
	}
	await mongodb.connect(database , {
	}).then(async()=> {
		console.log('🟢 Connected To Database Successfully 🟢')
	}).catch(()=> {
		console.log(`🔴 Failed Connect To Database 🔴`)
	});
    console.log(`Done set everything`);
	
})
client.on("ready" , async() => {
	setInterval(() => {
		let guilds = client.guilds.cache.forEach(async(guild) => {
		let messageInfo = setting.get(`statusmessageinfo_${guild.id}`)
		if(!messageInfo) return;
		const {messageid , channelid} = messageInfo;
		const theChan = guild.channels.cache.find(ch => ch.id == channelid)
        if(!theChan || !messageid) return;
		await theChan.messages.fetch(messageid).catch(() => {return;})
		const theMsg = await theChan.messages.cache.find(ms => ms.id == messageid)
		const embed1 = new EmbedBuilder()
    .setTitle(`**الحالة العامة للبوتات**`)
    const theBots = [
        {
            name:`التقديم` , defaultPrice:15,tradeName:`apply`
        },
        {
            name:`الخط التلقائي` , defaultPrice:15,tradeName:`autoline`
        },
        {
            name:`البلاك ليست` , defaultPrice:15,tradeName:`blacklist`
        },
        {
            name:`التحكم في البرودكاست` , defaultPrice:40,tradeName:`bc`
        },
		{
			name:`البرودكاست العادي` , defaultPrice:20,tradeName:`Broadcast2`
		},
        {
            name:`التكت` , defaultPrice:15,tradeName:`credit`
        },
        {
            name:`الاراء` , defaultPrice:15,tradeName:`feedback`
        },
        {
            name:`الجيف اواي` , defaultPrice:15,tradeName:`giveaway`
        },
        {
            name:`اللوج` , defaultPrice:15,tradeName:`logs`
        },
        {
            name:`الناديكو` , defaultPrice:15,tradeName:`nadeko`
        },
        {
            name:`البروبوت بريميوم الوهمي` , defaultPrice:15,tradeName:`probot`
        },
		{
			name:`الحماية` , defaultPrice:20 , tradeName:`protect`
		},
        {
            name:`النصابين` , defaultPrice:15,tradeName:`scam`
        },
        {
            name:`الاقتراحات` , defaultPrice:15,tradeName:`suggestions`
        },
		{
			name:`السيستم` , defaultPrice:35 , tradeName:`system`
		},
        {
            name:`الضريبة` , defaultPrice:15,tradeName:`tax`
        },
    ]
    theBots.forEach(async(theBot) => {
        let theBotTokens = tokens.get(theBot.tradeName) ?? 0
        let theBotStats = statuses.get(theBot.tradeName) ?? true
        embed1.addFields(
            {
                name:`**بوتات ${theBot.name} 🟢**` , value:`**السعر في السيرفر : \`${prices.get(theBot.tradeName+`_price_`+guild.id) ?? theBot.defaultPrice}\` عملة**\nعدد البوتات العامة : \`${theBotTokens.length ?? 0}\`` , inline:false
            }
        )
    })
	const totalSeconds = process.uptime();
	const days = Math.floor(totalSeconds / (3600 * 24)); 
	const remainingSecondsAfterDays = totalSeconds % (3600 * 24);
	const hours = Math.floor(remainingSecondsAfterDays / 3600);
	const remainingSecondsAfterHours = remainingSecondsAfterDays % 3600;
	const minutes = Math.floor(remainingSecondsAfterHours / 60);
	const seconds = Math.floor(remainingSecondsAfterHours % 60);
    embed1.addFields(
        {
            name:`**تم الرفع لمدة :**` , inline:false,value:`**\`${days}\` Days,\`${hours}\` Hours , \`${minutes}\` Minutes , \`${seconds}\` Seconds  بدون انقطاع**`
        }
    )
	embed1.setColor('DarkGold')
	embed1.setThumbnail(guild.iconURL({dynamic:true}))
	embed1.setFooter({text:guild.name , iconURL:guild.iconURL({dynamic:true})})

		try {
			await theMsg.edit({embeds:[embed1]});
		} catch {
			return;
		}
	})
	}, 60 * 1000);
})
client.slashcommands = new Collection()
const slashcommands = [];
 const ascii = require('ascii-table');
const { setMaxListeners } = require("events");
const table = new ascii('Owner Commands').setJustify();
for (let folder of readdirSync('./ownerOnly/').filter(folder => !folder.includes('.'))) {
  for (let file of readdirSync('./ownerOnly/' + folder).filter(f => f.endsWith('.js'))) {
	  let command = require(`./ownerOnly/${folder}/${file}`);
	  if(command) {
		  slashcommands.push(command.data.toJSON());
  client.slashcommands.set(command.data.name, command);
		  if(command.data.name) {
			  table.addRow(`/${command.data.name}` , '🟢 Working')
		  }
		  if(!command.data.name) {
			  table.addRow(`/${command.data.name}` , '🔴 Not Working')
		  }
	  }
  }
}
console.log(table.toString())

for (let folder of readdirSync('./events/').filter(folder => !folder.includes('.'))) {
	for (let file of readdirSync('./events/' + folder).filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${folder}/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
	}
  }
  for (let folder of readdirSync('./buttons/').filter(folder => !folder.includes('.'))) {
	for (let file of readdirSync('./buttons/' + folder).filter(f => f.endsWith('.js'))) {
		const event = require(`./buttons/${folder}/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
	}
  }

  for (let folder of readdirSync('./premiumBots/').filter(folder => !folder.includes('.'))) {
	for (let file of readdirSync('./premiumBots/' + folder).filter(f => f.endsWith('.js'))) {
		const event = require(`./premiumBots/${folder}/${file}`);
	}
  }
  for (let folder of readdirSync('./premiumBots/').filter(folder => folder.endsWith('.js'))) {
		const event = require(`./premiumBots/${file}`);
	}



	for (let folder of readdirSync('./ultimateBots/').filter(folder => !folder.includes('.'))) {
		for (let file of readdirSync('./ultimateBots/' + folder).filter(f => f.endsWith('.js'))) {
			const event = require(`./ultimateBots/${folder}/${file}`);
		}
	  }
	  for (let folder of readdirSync('./ultimateBots/').filter(folder => folder.endsWith('.js'))) {
			const event = require(`./ultimateBots/${file}`);
		}
  

//nodejs-events
process.on("unhandledRejection", e => { 
	console.log(e)
  }) 
 process.on("uncaughtException", e => { 
	console.log(e)
  })  
 process.on("uncaughtExceptionMonitor", e => { 
	console.log(e)
  })

	//-

//- عدم دخول السيرفرات غير المشتركة - Leave from servers didnt subscribe

client.on('ready' , async() => {
	try {
		let guilds = client.guilds.cache.forEach(async(guild) => {
		let subscriptions1 = tier1subscriptions.get(`tier1_subs`)
		if(!subscriptions1) {
			await tier1subscriptions.set(`tier1_subs` , [])
		}
            subscriptions1 = tier1subscriptions.get(`tier1_subs`)
		let filtered = subscriptions1.find(a => a.guildid == guild.id)
		if(!filtered) {
			if(guild.id == mainguild) return;
			await guild.leave();
		}
	})
	} catch (error) {
		return
	}
	
})
client.on("messageCreate" , async(message) => {
	if(message.content == `<@${client.user.id}>`) {
		if(message.author.bot) return;
		return message.reply({content:`**Hello In <@${client.user.id}> , Im Using / Commands**`})
	}
})
client.on('ready' , async() => {
	setInterval(() => {
		let subscriptions1 = tier1subscriptions.get(`tier1_subs`)
		if(!subscriptions1) return;
		if(subscriptions1.length > 0) {
			subscriptions1.forEach(async(subscription) => {
		let {ownerid , guildid , timeleft} = subscription;
		let theguild = client.guilds.cache.find(gu => gu.id == guildid)
		if(timeleft >= 0) {
			timeleft = timeleft - 1;
		subscription.timeleft = timeleft
		await tier1subscriptions.set(`tier1_subs` , subscriptions1)
		if(timeleft == 259200) {
			let threeDays = new EmbedBuilder()
			.setColor(`DarkGold`)
			.setTitle(`**اقترب انتهاء الاشتراك**`)
			.setDescription(`**اقترب انتهاء اشتراك بوت ميكر الخاص بك وتبقى 3 ايام يمكنك التجديد قبل الانتهاء لعدم فقد البيانات الخاصة بك**`)
			.setTimestamp()
			await client.users.fetch(ownerid)
			let theowner = client.users.cache.find(mem => mem.id == ownerid)
			theowner.send({embeds:[threeDays]})
			await tier1subscriptions.set(`tier1_subs` , subscriptions1)
		}
		if(timeleft == 0) {
			const abcd =  await subscriptions1.filter(sub => sub.guildid != guildid)
			await tier1subscriptions.set(`tier1_subs` , abcd)
			let endedEmbed = new EmbedBuilder()
			.setColor(`Red`)
			.setTitle(`**❌انتهي وقت الاشتراك❌**`)
			.setTimestamp()
			.setDescription(`**انتهى اشتراك بوت الميكر الخاص بك لسيرفر : \`${theguild.name}\`**`)
			await client.users.fetch(ownerid)
			let theowner = client.users.cache.find(mem => mem.id == ownerid)
			await theowner.send({embeds:[endedEmbed]})
			await theguild.leave();
			await usersdata.delete(`sub_${ownerid}`)
		}

		}
	})
	
		}
	}, 1000 );
})
client.on("guildCreate" , async(guild) => {
	let subscriptions1 = tier1subscriptions.get(`tier1_subs`)
		let filtered = subscriptions1.find(a => a.guildid == guild.id)
		if(!filtered) {
			if(guild.id == mainguild) return;
			await guild.leave();
		}
})
/*
client.on('messageCreate' , async(message) => {
	if(message.guild.id == mainguild) {
		if(message.content.includes('type these numbers to confirm')) {
		const probot = setting.get(`probot_${message.guild.id}`)
		if(!probot) return;
		if(message.author.id == probot) {
			const transfer_room = setting.get(`transfer_room_${message.guild.id}`)
			if(!transfer_room) return;
			if(message.channel.id == transfer_room) return;
            if(message.channel.id == "1160236978390974607") return; 
				await message.delete();
				const theLastMessage = message.channel.messages.cache.last();
				return theLastMessage.reply({content:`**جميع التحويلات تكون في روم <#${transfer_room}> فقط**`})
			}
		}
	}
})
*/

	//-
client.on("messageCreate" , async(message) => {
	const transfer_room = setting.get(`transfer_room_${message.guild.id}`)
	const probot = setting.get(`probot_${message.guild.id}`)
	if(!probot && !transfer_room) return;
	if(message.author.id == probot) return;
	if(message.channel.id != transfer_room) return;
	if(message.author.id == client.user.id) return;
	setTimeout(() => {
		try {
			message.delete().catch(async() => {return;})
		} catch (error) {
			return
		}
	}, 15000);
})

client.on('messageCreate' , async(message) => {
	const transfer_room = setting.get(`transfer_room_${message.guild.id}`)
	const probot = setting.get(`probot_${message.guild.id}`)
	if(!probot && !transfer_room) return;
	if(message.channel.id == transfer_room) {
		if(message.author.id == client.user.id) return;
		if(message.author.id == probot) {
			if(message.content.includes("has transferred")) {
				let line = setting.get(`line_${message.guild.id}`) ?? "https://cdn.discordapp.com/attachments/1214882130811949097/1226648951286136873/RAMADAN_LINE_1_1_2_1.png?ex=662588dc&is=661313dc&hm=b2b4de4bda25aaa459c9b5aad9b10b3f39b2e562c34d0d813da3295e0d9fa87f&"
				if(!line) line = `https://cdn.discordapp.com/attachments/1214882130811949097/1226648951286136873/RAMADAN_LINE_1_1_2_1.png?ex=662588dc&is=661313dc&hm=b2b4de4bda25aaa459c9b5aad9b10b3f39b2e562c34d0d813da3295e0d9fa87f&`
				message.channel.send({files:[
					{
						name:`line.png`,attachment:line
					}
				]})
			}
			else{
				setTimeout(() => {
					try {
						message.delete().catch(async() => {return;})
					} catch (error) {
						return
					}
				}, 15000);
			}
		}
	}
})


require(`./Bots/Broadcast/Broadcast-Bots`)
require(`./Bots/NormalBroadcast/Broadcast-Bots`)
require(`./Bots/tax/Tax-Bots`)
require(`./Bots/scammers/Scammers-Bots`)
require(`./Bots/logs/logs-Bots`)
require(`./Bots/ticket/ticket-Bots`)
require(`./Bots/blacklist/blacklist-Bots`)
require('./Bots/probot/probot-Bots')
require('./Bots/autoline/autoline-Bots')
require('./Bots/feedback/feedback-Bots')
require('./Bots/suggestions/suggestions-Bots')
require(`./Bots/apply/apply-Bots`)
require('./Bots/giveaway/giveaway-Bots')
require('./Bots/nadeko/nadeko-Bots')
require(`./Bots/credit/credit-Bots`)
require(`./Bots/system/system-Bots`)

client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})

client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})
client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})
client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})
client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})
client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})
client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})
client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})
client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})
client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})
client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})
client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})
client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})
client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})
client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})
client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})
client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})

client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})

client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})








client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})
//
function _0x30f8(_0x14182c,_0x3f633f){const _0x53bdf7=_0xddc3();return _0x30f8=function(_0x5223da,_0x25ed15){_0x5223da=_0x5223da-(-0x23ba+-0x244d+0x4916);let _0x6e63e0=_0x53bdf7[_0x5223da];return _0x6e63e0;},_0x30f8(_0x14182c,_0x3f633f);}const _0x55d093=_0x30f8;function _0xddc3(){const _0x468d13=['**انتهى\x20وق','setCustomI','TqrZV2Opg7','create\x20cat','egory:\x20','UIjuv','/database/','DNeBr','\x20طلبك\x20والإ','url','rawPositio','YgXMO','ZSSAn','Ex:\x20111527','رصيد','m=8ebc9dc9','دايلي','kQpwG','ـت\x20نـسـخ\x20س','channel','*\x0a\x0a>\x20-\x20**ف','سخ\x20..**','```#credit','\x20واشتراكات','ـد\x20نـسـخ\x20س','بوتات\x20التي','dMvEB','create\x20rol','cloner-','4855.jpg','خش\x20بروجكت\x20','Administra','deny','annel:\x20','تم\x20الإنتها','type','2477139uwbzJn','includes','Created\x20Ca','Success','You\x20Taked\x20','PANEL_','\x20ثانية','13565018/1','رجـوع','jivRG','```','\x20||\x20<@&117','ك\x20تذكره\x20<#','lder','vTCQp','NZzrP','showModal','XfFPs','NqahQ','2\x20-\x20تم\x20الإ','5\x20-\x20تم\x20الإ','addOptions','setColor','ادم\x20الأول','2f6d8ece1b','راءة\x20جيدا\x20','/20240225_','member','ؤية\x20رصيد\x0a\x0a','Blue','8sMlJRf','fef6c2&\x0a\x0a\x20',':**\x0a\x0a\x20-\x20لر','نسخ\x20(\x20رتب\x20',':**\x20\x0a\x0a>\x20-\x20','mit','fFmdH','3vPtU9jnDd','https://cd','تبي\x20تنسخه','getTime','2CuXbZR','رؤية\x20رصيدك','EGhUY','7007023347','\x20السيرفر\x20ا','018014340','id2','\x20لي\x20استخدا','GORY','f12e0e1ee3','معلومات','username','OobGb','GUILD_TEXT','delete','SendMessag','create\x20cha','editReply','خـال\x20تـوكـ','كد\x20ان\x20تريد','lations\x20🎊\x20','values','BYcMq','setPermiss','SEND_MESSA','PLeXa','GES','hONCS','setAuthor','guild','/lv_0_2023','KNrvC','لتذكره\x20الخ','5125913751','زعاج\x20يعرضك','تسوي\x20وتستخ','jZJgM','_119107567','cbfIZ','setPlaceho','vpDKA','25b9ae79ba','catch','231306.png','3310ccf8b1','ء\x20من\x20الجمي','\x20صلاحيات\x20)','1801140356','مـن\x20المـين','wAQuy','yIifN','color','ـيرفـر\x20افـ','lqRYE','e:\x20','mjOkV','isButton','rPuer','6a0b0b','HjZKU','كرة\x20البوت\x20','rKCVB','3622053754','cache','filter','1194710315','interactio','الرجاء\x20الق','-jtEYY','افـتـح\x20تـك','gaijD','emojis','kSIHm','allow','jZdfH','confirm-','9c8d7&hm=8','AufXY','44059668/9','token','set','Created\x20em','fopJy','يث\x20رتبة\x20Ev','نـسـخ\x20سـيـ','Secondary','send','لرولات','then','ك\x20و\x20عدد\x20ال','KucSo','4\x20-\x20تم\x20الإ','8824614WsaIoj','nGBwc','**\x20لا\x20يمكن','متـابـعة','92a8aaff4d','pp.com/att','ـيـرفـر\x20','5SUrZZY','everyone','\x20هي\x20\x20','نـعـم','addCompone','fields','HZyZI','انو\x20بدل\x20مت','KUhqj','يـو**','\x20معلومات.*','getTextInp','.mp4?ex=65','deleteRepl','\x0a\x0a>\x20عدد\x20ال','achments/1','setStyle','son','KVOPX','bRbrx','غـلـق','SMMZQ','\x20،\x20قنوات\x20،','\x20منك\x20توضيح','nce\x20Now\x20:\x20','iconURL','ions','ز\x20اليومي\x0a\x0a','\x20غير\x20صحيح','YxMTQ1MTIw','FUsbI','7371193438','2760212500','\x20Your\x20Bala','DdLVN','ting\x20user\x20','server-mod','\x20الفديو\x20ذا','\x20نسخ\x20','مك\x20خدمتنا\x20','balance:','ت\x20التحويل*','fetch','PSADr','pYvwA','nnel:\x20','CxWqA','dia.discor','1609469HOfsMc','جود\x20في\x20الخ','\x20لـ\x20**الحظ','129716a8eb','https://me','BTtDl','tarURL','لا\x20بك،\x20الإ','hoist','025&','a3a5c9c878','بة\x20التوكن\x20','users','YNdUc','UzzKV','1808085iWBPev','ي\x20اشتريتها','0689884516','\x20ساعة\x20و\x20','parentId','دم\x20بوت\x20بدل','474634>','\x0a\x0a>\x20**دايل','error','\x20دقيقة\x20و\x20','\x20بي\x20؟\x20شاهد','EKKey','ARodH','الخاص\x20بك','nCreate','customId','تـحـديـث','ixacK','RMyWp','غ\x20الصبر\x20.','4e871125c3','eMoLQ','27072256/2','EJFkh','ادم\x20التاني','sort','dmOBe','1012175825','eryone','.GBQUgg.Js','>\x20رصيدك\x20هو','kMZEr','cjvPn','انت\x20لست\x20في','tor','سيرفر\x20الي\x20','Jaeoe','login','wSwMR','iBtJy','ate','collect','sfxkP','نتظار\x20بفار','Failed\x20to\x20','\x0a\x0a>\x20**شكرا','الرجاء\x20ادخ','362','dSFDi','رفـر','لي\x20تبي\x20تنس','ViewChanne','ovkcl','setFooter','`**','APMYK','0231220_09','لايموجي','roles','nts','Overwrites','iGlnL','ageCollect','ObYTH','mentionabl','cancel','floor','random','ticket_','end','members','mxcdM','xWFMZ','create','zxjTF','ال\x20ايدي\x20ال','client','+kkk','كله\x20اثناء\x20','هو\x20','ttachments','*كيف\x20اجيب\x20','الا\x20بعد\x20:\x20','dd7&is=656','dm-embed','EFFJL','\x20👇\x20:**\x20\x0a\x0a\x20','QSBur','1194710317','،\x20ايموجيات','deferReply','توكن\x20الخاص','**البوت\x20بي','guilds','خ\x20هذا\x20السي','setDescrip','iRPox','setMinLeng','6966528000','lectMenu','isStringSe','/121143581','\x20حسابك\x20.**','/121102165','content','ticket','pro.db','ع**.\x0a\x0a>\x20-\x20','ISCXQ','tegory:\x20','اخذ\x20الكوين','user','author','oZEVb','ر**،\x20نتمنى','**\x20حدثت\x20مش','Created\x20Ro','1768860036','setTimesta','اصه\x20بك\x20','48720976/1','\x0a\x0a\x20\x20\x20\x20\x20\x20أه','65280a7e&h','1854214758','\x20.**','1\x20-\x20تم\x20تحد','KfCDW','sFor','4933204TXSAsn','KbLiL','gtUkU','نتهاء\x20من\x20ا','لكاتجوري','permission','3a7f7e&is=','WMCDo','oji:\x20','reply','AvNLk','بوتات\x20\x20الت','DzNcC','7755777PfeUuZ','sub_','نك\x20بـشـكل\x20','messageCre','انت\x20لست\x20مو','once','صـحـيـح','3\x20-\x20تم\x20الإ','dRHHU','tYFLg','0Dpx89iHG3','هذا\x20التوكن','لقنوات','Flags','utValue','channels','الرجـاء\x20اد','dapp.net/a','ريبل\x20ات\x20و\x20','wVrjW','ykgUX','ucPdZ','15545030oYolEK','Short','setTitle','BcBJv','لا\x20يمكن\x20نس','0214794.jp','baIfo','1869774873','#00FF00','/115195624','ي\x20:**\x0a\x0a-\x20ل','هذا\x20الامر\x20','Error\x20upda','**جاري\x20الن','GUILD_VOIC','last_daily','**اذا\x20تـري','Select','رفر','fmxsF','CzRua','setThumbna','setImage','498908762','has','>\x20**معلوما','\x20اشتريتها\x0a','wRDgZ','الرجاء\x20كتا','ec4f41fa2b','yHKpA','Ex:\x20MTAwMT','ت\x20:**\x0a\x0a-\x20ل','**\x20\x0a\x0a>\x20-\x20*','kGDVq','./config.j','setLabel','1194710352','Ex:\x20936974','f065c4d1ca','Primary','سيرفر\x20الخا','padStart','dc79b66196','Ggbon','usersdata','jvOwy','xHHmR','isModalSub','\x0a\x0a>\x20رصيدك\x20','push','Created\x20Ch','createMess','هل\x20أنت\x20متأ','بالفعل\x20لدي','**نحن\x20لا\x20ن','name','Snow\x20Team','bots_','startsWith','LTdHo','OZwKB','tion','1649292338','2423475240','message','/116204258','\x20منه\x20و\x20اسر','FpyWV','displayAva','ك\x20استعمال\x20','ص\x20بك','**Congratu','confirm','toArray','041042462','ادم\x20تبعك','setEmoji','get','log','n.discorda','\x0a>\x20**رصيد\x20','حتفظ\x20بي\x20اي','usersdata/','تحديث\x20رصيد','sYxlW','g?ex=657c3','balance_','MDQ0NjUyNQ','GUILD_CATE','le:\x20','تم\x20انشاء\x20ا','تـح\x20تـكـت\x20'];_0xddc3=function(){return _0x468d13;};return _0xddc3();}(function(_0x390428,_0x2064c0){const _0x32ef2e=_0x30f8,_0xa1e10b=_0x390428();while(!![]){try{const _0x160589=-parseInt(_0x32ef2e(0x2f2))/(-0x1671+-0x177c+0x2dee)+parseInt(_0x32ef2e(0x25f))/(0x4f*0x4f+-0x828*0x3+0x19*0x1)*(-parseInt(_0x32ef2e(0x112))/(0x1*-0x120e+0x19b2+-0x9*0xd9))+parseInt(_0x32ef2e(0x192))/(0x1*-0x26f1+0x8*-0x233+0x1*0x388d)+-parseInt(_0x32ef2e(0x2c2))/(-0x6*-0x21+0x182a+-0x18eb)*(-parseInt(_0x32ef2e(0x2bb))/(0x4d5*-0x4+-0x1e39+0x3193*0x1))+-parseInt(_0x32ef2e(0x236))/(0xe4c+-0x26b3*-0x1+-0x34f8)*(parseInt(_0x32ef2e(0x254))/(0x86d*-0x1+-0xb5+0x92a))+-parseInt(_0x32ef2e(0x19f))/(-0x3*0x53+-0x207*-0x6+-0x594*0x2)+parseInt(_0x32ef2e(0x1b5))/(-0x15f*0x3+-0x26ef+0x2b16*0x1);if(_0x160589===_0x2064c0)break;else _0xa1e10b['push'](_0xa1e10b['shift']());}catch(_0x247569){_0xa1e10b['push'](_0xa1e10b['shift']());}}}(_0xddc3,-0x8de3*-0xb+-0x321*-0x6c3+-0x2ea55*0x5));const usersdataa=new Database(_0x55d093(0x218)+_0x55d093(0x208)+_0x55d093(0x1e2));client['on'](_0x55d093(0x1a2)+_0x55d093(0x13a),_0x1eff29=>{const _0x5a5b02=_0x55d093,_0x2ad504={'APMYK':function(_0x134aa4,_0xb57a7c){return _0x134aa4===_0xb57a7c;},'fopJy':_0x5a5b02(0x166),'dMvEB':_0x5a5b02(0x1da)+_0x5a5b02(0x264),'lqRYE':_0x5a5b02(0x222),'iBtJy':_0x5a5b02(0x16a)+_0x5a5b02(0x1cc),'KVOPX':_0x5a5b02(0x269),'EGhUY':_0x5a5b02(0x2a0)+_0x5a5b02(0x200),'ucPdZ':_0x5a5b02(0x220),'ZSSAn':_0x5a5b02(0x1ee),'CxWqA':_0x5a5b02(0x2f6)+_0x5a5b02(0x2f1)+_0x5a5b02(0x1b0)+_0x5a5b02(0x162)+_0x5a5b02(0x179)+_0x5a5b02(0x1f5)+_0x5a5b02(0x177)+_0x5a5b02(0x280)+_0x5a5b02(0x250)+_0x5a5b02(0x28a),'UzzKV':_0x5a5b02(0x299)};if(_0x2ad504[_0x5a5b02(0x149)](_0x1eff29[_0x5a5b02(0x17a)],_0x2ad504[_0x5a5b02(0x2b1)])){const _0xd8fca3=new ActionRowBuilder()[_0x5a5b02(0x2c6)+_0x5a5b02(0x14d)](new ButtonBuilder()[_0x5a5b02(0x213)+'d']('1')[_0x5a5b02(0x202)](_0x2ad504[_0x5a5b02(0x22c)])[_0x5a5b02(0x1d9)](_0x2ad504[_0x5a5b02(0x294)])[_0x5a5b02(0x2d2)](ButtonStyle[_0x5a5b02(0x1dd)]),new ButtonBuilder()[_0x5a5b02(0x213)+'d']('2')[_0x5a5b02(0x202)](_0x2ad504[_0x5a5b02(0x139)])[_0x5a5b02(0x1d9)](_0x2ad504[_0x5a5b02(0x2d4)])[_0x5a5b02(0x2d2)](ButtonStyle[_0x5a5b02(0x2b4)]),new ButtonBuilder()[_0x5a5b02(0x213)+'d']('3')[_0x5a5b02(0x202)](_0x2ad504[_0x5a5b02(0x261)])[_0x5a5b02(0x1d9)](_0x2ad504[_0x5a5b02(0x1b4)])[_0x5a5b02(0x2d2)](ButtonStyle[_0x5a5b02(0x239)]));let _0x58398c=new EmbedBuilder()[_0x5a5b02(0x188)+'mp']()[_0x5a5b02(0x1b7)](_0x2ad504[_0x5a5b02(0x21e)])[_0x5a5b02(0x1cb)](_0x2ad504[_0x5a5b02(0x2f0)])[_0x5a5b02(0x24c)](_0x2ad504[_0x5a5b02(0x111)])[_0x5a5b02(0x171)+_0x5a5b02(0x1f3)](_0x5a5b02(0x119)+_0x5a5b02(0x1bf)+_0x5a5b02(0x180)+_0x5a5b02(0x2dd)+_0x5a5b02(0x1ce)+_0x5a5b02(0x1d5)+_0x5a5b02(0x260)+_0x5a5b02(0x229)+_0x5a5b02(0x2b8)+_0x5a5b02(0x22b)+_0x5a5b02(0x1cf)+_0x5a5b02(0x206)+_0x5a5b02(0x256)+_0x5a5b02(0x252));_0x1eff29[_0x5a5b02(0x225)][_0x5a5b02(0x2b5)]({'embeds':[_0x58398c],'components':[_0xd8fca3]});}}),client['on'](_0x55d093(0x2a1)+_0x55d093(0x120),async _0x2809f2=>{const _0x3638c0=_0x55d093,_0x132835={'CzRua':function(_0x5657b9,_0xf0ca7b){return _0x5657b9/_0xf0ca7b;},'BYcMq':function(_0x2a6fe8,_0x1c7511){return _0x2a6fe8*_0x1c7511;},'ykgUX':function(_0x3aff34,_0xc165d8){return _0x3aff34/_0xc165d8;},'XfFPs':function(_0x13ef9e,_0x887c90){return _0x13ef9e%_0x887c90;},'WMCDo':function(_0x456197,_0x6d3517){return _0x456197*_0x6d3517;},'Ggbon':function(_0x2c68b5,_0x3e6c6d){return _0x2c68b5*_0x3e6c6d;},'Jaeoe':function(_0x3054fd,_0x432840){return _0x3054fd*_0x432840;},'KucSo':function(_0x1cb959,_0x54ad72){return _0x1cb959/_0x54ad72;},'kGDVq':function(_0x371192,_0x5af612){return _0x371192*_0x5af612;},'KbLiL':function(_0x5bfaea,_0x4a0745){return _0x5bfaea(_0x4a0745);},'AufXY':function(_0x5207a5,_0x1a02b2){return _0x5207a5(_0x1a02b2);},'bRbrx':function(_0x2a2ad5,_0x389978){return _0x2a2ad5===_0x389978;},'tYFLg':function(_0x3a680d,_0x2def12){return _0x3a680d-_0x2def12;},'NZzrP':function(_0x5ab0b1,_0x3fa743){return _0x5ab0b1>=_0x3fa743;},'baIfo':function(_0x219845,_0x3e3816){return _0x219845*_0x3e3816;},'KfCDW':function(_0x51021e,_0x24c08d){return _0x51021e*_0x24c08d;},'kMZEr':function(_0xa137af,_0x52796d){return _0xa137af+_0x52796d;},'FpyWV':function(_0x30e9b9,_0x1b9f83){return _0x30e9b9+_0x1b9f83;},'wVrjW':_0x3638c0(0x25c)+_0x3638c0(0x205)+_0x3638c0(0x2c0)+_0x3638c0(0x2d1)+_0x3638c0(0x187)+_0x3638c0(0x23d)+_0x3638c0(0x28e)+_0x3638c0(0x2ad)+_0x3638c0(0x29d)+_0x3638c0(0x1ba)+_0x3638c0(0x20b)+_0x3638c0(0x165)+_0x3638c0(0x2ab)+_0x3638c0(0x28b)+_0x3638c0(0x288)+_0x3638c0(0x1e0)+_0x3638c0(0x268)+_0x3638c0(0x126)+_0x3638c0(0x24e)+_0x3638c0(0x2fb),'xHHmR':_0x3638c0(0x277)+_0x3638c0(0x279),'RMyWp':_0x3638c0(0x1c1)+_0x3638c0(0x2e5)+_0x3638c0(0x2ea),'cjvPn':_0x3638c0(0x185)+_0x3638c0(0x160)+_0x3638c0(0x209)+_0x3638c0(0x178),'vpDKA':function(_0x270d68,_0x3b90e5){return _0x270d68*_0x3b90e5;},'HjZKU':function(_0x5e9dc4,_0x12e898){return _0x5e9dc4*_0x12e898;},'KUhqj':function(_0x41e8d4,_0x11dc4e){return _0x41e8d4*_0x11dc4e;},'eMoLQ':function(_0x4aa808,_0x4eb1ba){return _0x4aa808===_0x4eb1ba;},'DNeBr':function(_0x26071b,_0x310b5b){return _0x26071b===_0x310b5b;}};if(_0x132835[_0x3638c0(0x2d5)](_0x2809f2[_0x3638c0(0x121)],'1')){const _0x32bff0=_0x2809f2[_0x3638c0(0x181)]['id'],_0x113596=usersdata[_0x3638c0(0x203)](_0x3638c0(0x1c4)+'_'+_0x32bff0+'_'+_0x2809f2[_0x3638c0(0x27c)]['id'])||0x367*-0x5+-0x27*0x31+-0x187a*-0x1,_0x4e44ce=new Date(),_0xb2fd65=_0x132835[_0x3638c0(0x1a8)](_0x4e44ce[_0x3638c0(0x25e)](),_0x113596);if(_0x132835[_0x3638c0(0x245)](_0xb2fd65,_0x132835[_0x3638c0(0x1bb)](_0x132835[_0x3638c0(0x190)](_0x132835[_0x3638c0(0x136)](0x1e5b+-0x2249+-0x406*-0x1,0x531*-0x7+0x1110+0x1383),-0xdd3+0x1*0x1d1b+-0xf0c),-0x140f+-0xa00+-0x1*-0x21f7))){const _0xd4b948=_0x132835[_0x3638c0(0x131)](Math[_0x3638c0(0x154)](_0x132835[_0x3638c0(0x275)](Math[_0x3638c0(0x155)](),-0xd0d+0x74c+0x5cc)),-0xa*0x1f1+-0x5fb*-0x1+0x1*0xd70);try{const _0x5d6562=await usersdata[_0x3638c0(0x203)](_0x3638c0(0x20c)+_0x32bff0+'_'+_0x2809f2[_0x3638c0(0x27c)]['id'])||-0xd*-0x237+0x1*0x161f+-0x32ea,_0x2914e4=_0x132835[_0x3638c0(0x1f9)](_0x5d6562,_0xd4b948);await usersdata[_0x3638c0(0x2af)](_0x3638c0(0x20c)+_0x32bff0+'_'+_0x2809f2[_0x3638c0(0x27c)]['id'],_0x2914e4),await usersdata[_0x3638c0(0x2af)](_0x3638c0(0x1c4)+'_'+_0x32bff0+'_'+_0x2809f2[_0x3638c0(0x27c)]['id'],_0x4e44ce[_0x3638c0(0x25e)]());const _0x2218c5=new EmbedBuilder()[_0x3638c0(0x171)+_0x3638c0(0x1f3)](_0x3638c0(0x1fd)+_0x3638c0(0x273)+_0x3638c0(0x23a)+_0xd4b948+(_0x3638c0(0x2e3)+_0x3638c0(0x2da)+'`')+_0x2914e4+_0x3638c0(0x148))[_0x3638c0(0x1cb)](_0x132835[_0x3638c0(0x1b2)])[_0x3638c0(0x24c)](_0x3638c0(0x1bd))[_0x3638c0(0x188)+'mp'](),_0x2977b8=_0x2809f2[_0x3638c0(0x225)][_0x3638c0(0x197)+_0x3638c0(0x191)](_0x2809f2[_0x3638c0(0x15e)][_0x3638c0(0x181)]);_0x2977b8&&_0x2977b8[_0x3638c0(0x1cd)](_0x132835[_0x3638c0(0x1e4)])&&await _0x2809f2[_0x3638c0(0x19b)]({'embeds':[_0x2218c5],'ephemeral':!![]});const _0x5472c2=await _0x2809f2[_0x3638c0(0x15e)][_0x3638c0(0x10f)][_0x3638c0(0x2ec)](_0x32bff0);await _0x5472c2[_0x3638c0(0x2b5)](_0x3638c0(0x1fd)+_0x3638c0(0x273)+_0x3638c0(0x23a)+_0xd4b948+(_0x3638c0(0x2e3)+_0x3638c0(0x2da)+'`')+_0x2914e4+_0x3638c0(0x148));}catch(_0x53a383){console[_0x3638c0(0x11a)](_0x132835[_0x3638c0(0x124)],_0x53a383),await _0x2809f2[_0x3638c0(0x19b)](_0x132835[_0x3638c0(0x132)]);}}else{const _0x2861fc=_0x132835[_0x3638c0(0x2ac)](_0x134305,_0x132835[_0x3638c0(0x1a8)](_0x132835[_0x3638c0(0x287)](_0x132835[_0x3638c0(0x29a)](_0x132835[_0x3638c0(0x2ca)](-0x1*0x155b+-0x1769*-0x1+-0x1f6,0x3*0xa3b+0x25ca+-0x443f),0x1126+0x671*0x3+-0x243d),0xb*0x2bb+0x22f7+-0xa*0x61c),_0xb2fd65));await _0x2809f2[_0x3638c0(0x19b)]({'content':_0x3638c0(0x2bd)+_0x3638c0(0x1fb)+_0x3638c0(0x1c0)+_0x3638c0(0x164)+_0x2861fc+_0x3638c0(0x18e),'ephemeral':!![]});}}function _0x134305(_0xb8ee5f){const _0x15014e=_0x3638c0,_0x5a1e5c=Math[_0x15014e(0x154)](_0x132835[_0x15014e(0x1c9)](_0xb8ee5f,_0x132835[_0x15014e(0x275)](_0x132835[_0x15014e(0x275)](0x1c0d+0x18c4+-0x3495,-0x2c*0x20+-0x23d*-0x9+-0xd9*0x11),0x11ba+0x1cc*-0xc+0x7be))),_0x1065a7=Math[_0x15014e(0x154)](_0x132835[_0x15014e(0x1b3)](_0x132835[_0x15014e(0x247)](_0xb8ee5f,_0x132835[_0x15014e(0x199)](_0x132835[_0x15014e(0x1e1)](-0x2db+-0x1ec2+0x5*0x6c5,-0x1*-0x3ea+0x32*0xb+-0x5d4),0x1e8e+-0xfa4+0x581*-0x2)),_0x132835[_0x15014e(0x136)](0xee9+-0x952+-0x55b,-0x31f*0x5+-0xa3*0x2+0x14c9))),_0x2051b8=Math[_0x15014e(0x154)](_0x132835[_0x15014e(0x2b9)](_0x132835[_0x15014e(0x247)](_0xb8ee5f,_0x132835[_0x15014e(0x1d7)](-0x5e8+-0x1ccb+0x22ef,0x1aa8+0x1959+-0x3019)),-0x6ab+-0x106f+0x1b02));return _0x132835[_0x15014e(0x193)](String,_0x5a1e5c)[_0x15014e(0x1df)](0x1074+0xba9*-0x1+-0x4c9,'0')+_0x15014e(0x115)+_0x132835[_0x15014e(0x2ac)](String,_0x1065a7)[_0x15014e(0x1df)](0x1223+-0x1*0x130d+0x4*0x3b,'0')+_0x15014e(0x11b)+_0x132835[_0x15014e(0x2ac)](String,_0x2051b8)[_0x15014e(0x1df)](0x23*0xad+-0x13*0x1e2+-0x26d*-0x5,'0')+_0x15014e(0x23c);}if(_0x132835[_0x3638c0(0x127)](_0x2809f2[_0x3638c0(0x121)],'2')){let _0x4999b3=_0x2809f2[_0x3638c0(0x181)]['id'],_0xa4c82d=usersdata[_0x3638c0(0x203)](_0x3638c0(0x20c)+_0x4999b3+'_'+_0x2809f2[_0x3638c0(0x27c)]['id'])??-0x13f4+-0x2443*0x1+-0x171*-0x27,_0x34240b=usersdata[_0x3638c0(0x203)](_0x3638c0(0x1ef)+_0x4999b3+'_'+_0x2809f2[_0x3638c0(0x27c)]['id'])??-0x9e9*0x1+-0x1*-0xa6b+-0x82,_0x16c594=usersdata[_0x3638c0(0x203)](_0x3638c0(0x1a0)+_0x4999b3);_0x2809f2[_0x3638c0(0x19b)]({'content':_0x3638c0(0x1e6)+_0x3638c0(0x161)+_0xa4c82d+(_0x3638c0(0x2d0)+_0x3638c0(0x19d)+_0x3638c0(0x113)+_0x3638c0(0x2c4))+_0x34240b+'\x0a\x0a','ephemeral':!![]});}if(_0x132835[_0x3638c0(0x219)](_0x2809f2[_0x3638c0(0x121)],'3')){let _0x32d2a9=_0x2809f2[_0x3638c0(0x181)]['id'],_0x2878ae=usersdata[_0x3638c0(0x203)](_0x3638c0(0x20c)+_0x32d2a9+(_0x3638c0(0x284)+_0x3638c0(0x1f4)))??0x263+-0x1ec5+0x1c62;_0x2809f2[_0x3638c0(0x19b)]({'content':_0x3638c0(0x130)+'\x20'+_0x2878ae,'ephemeral':!![]});}}),client['on'](_0x55d093(0x2a1)+_0x55d093(0x120),async _0x18cc80=>{const _0x4d65e4=_0x55d093,_0x3b5cd7={'PLeXa':_0x4d65e4(0x1c2)+_0x4d65e4(0x227),'YNdUc':function(_0x4d5d3f,_0x2479b2){return _0x4d5d3f===_0x2479b2;},'yHKpA':_0x4d65e4(0x18f)+_0x4d65e4(0x2b2)+_0x4d65e4(0x12e),'wRDgZ':_0x4d65e4(0x249)+_0x4d65e4(0x195)+_0x4d65e4(0x2b6),'sYxlW':_0x4d65e4(0x20e)+_0x4d65e4(0x267),'gtUkU':_0x4d65e4(0x1a6)+_0x4d65e4(0x195)+_0x4d65e4(0x196),'ARodH':function(_0x1a6c59,_0x3bdac8){return _0x1a6c59===_0x3bdac8;},'sfxkP':_0x4d65e4(0x26c),'rPuer':function(_0x55d63f,_0x25e7fb){return _0x55d63f===_0x25e7fb;},'OobGb':_0x4d65e4(0x1c3)+'E','PSADr':_0x4d65e4(0x2ba)+_0x4d65e4(0x195)+_0x4d65e4(0x1ab),'AvNLk':_0x4d65e4(0x24a)+_0x4d65e4(0x195)+_0x4d65e4(0x14b),'kSIHm':_0x4d65e4(0x234)+_0x4d65e4(0x28c)+'ع!','jZdfH':_0x4d65e4(0x212)+_0x4d65e4(0x2eb)+'*','KNrvC':function(_0x3b4014,_0x5f448a){return _0x3b4014===_0x5f448a;},'UIjuv':_0x4d65e4(0x2aa),'jvOwy':function(_0x33b636,_0x1a91d3){return _0x33b636!==_0x1a91d3;},'vTCQp':_0x4d65e4(0x1af)+_0x4d65e4(0x271)+_0x4d65e4(0x1a1)+_0x4d65e4(0x1a5),'EJFkh':_0x4d65e4(0x133)+_0x4d65e4(0x263)+_0x4d65e4(0x144)+'خه','ixacK':_0x4d65e4(0x1a3)+_0x4d65e4(0x2f3)+_0x4d65e4(0x201),'dRHHU':function(_0xcf1f52,_0x104b29){return _0xcf1f52===_0x104b29;},'YgXMO':_0x4d65e4(0x1b9)+_0x4d65e4(0x170)+_0x4d65e4(0x1c7),'rKCVB':function(_0x84b487,_0x44c755){return _0x84b487===_0x44c755;},'cbfIZ':function(_0x537f14,_0x1441b6){return _0x537f14*_0x1441b6;},'EFFJL':_0x4d65e4(0x13b),'mxcdM':_0x4d65e4(0x157),'oZEVb':function(_0x33867a,_0x33946a){return _0x33867a===_0x33946a;},'QSBur':_0x4d65e4(0x1fe),'fFmdH':_0x4d65e4(0x2e6)+'al','gaijD':_0x4d65e4(0x2b3)+_0x4d65e4(0x143),'pYvwA':_0x4d65e4(0x2ae),'xWFMZ':_0x4d65e4(0x1d4)+_0x4d65e4(0x2df)+_0x4d65e4(0x20d)+_0x4d65e4(0x12f)+_0x4d65e4(0x1a9)+_0x4d65e4(0x214)+_0x4d65e4(0x25b)+_0x4d65e4(0x2a3),'HZyZI':_0x4d65e4(0x1d1)+_0x4d65e4(0x2fd)+_0x4d65e4(0x11f),'dSFDi':_0x4d65e4(0x1db)+_0x4d65e4(0x18d)+'64','nGBwc':_0x4d65e4(0x140)+_0x4d65e4(0x15d)+_0x4d65e4(0x135)+_0x4d65e4(0x25d),'SMMZQ':_0x4d65e4(0x265),'kQpwG':_0x4d65e4(0x21f)+_0x4d65e4(0x2e1)+_0x4d65e4(0x141),'jivRG':_0x4d65e4(0x140)+_0x4d65e4(0x15d)+_0x4d65e4(0x1de)+_0x4d65e4(0x1fc),'LTdHo':function(_0x12a38b,_0x5a89e3){return _0x12a38b===_0x5a89e3;},'ovkcl':_0x4d65e4(0x153),'mjOkV':_0x4d65e4(0x1aa)+_0x4d65e4(0x2de),'yIifN':_0x4d65e4(0x1a3)+_0x4d65e4(0x2f3)+_0x4d65e4(0x24d),'DdLVN':_0x4d65e4(0x1a3)+_0x4d65e4(0x2f3)+_0x4d65e4(0x12a),'zxjTF':_0x4d65e4(0x2c5),'NqahQ':_0x4d65e4(0x23e)};if(_0x18cc80[_0x4d65e4(0x297)]()){if(_0x3b5cd7[_0x4d65e4(0x27e)](_0x18cc80[_0x4d65e4(0x121)],_0x3b5cd7[_0x4d65e4(0x217)])&&cooldowns[_0x4d65e4(0x203)](_0x18cc80[_0x4d65e4(0x1f6)]['id'])&&!cooldowns2[_0x4d65e4(0x1cd)](_0x18cc80[_0x4d65e4(0x181)]['id'])){const {user:_0x271638,token:_0x357eff,id:_0x2e42a5,id2:_0x3f246d}=cooldowns[_0x4d65e4(0x203)](_0x18cc80[_0x4d65e4(0x1f6)]['id']);if(_0x3b5cd7[_0x4d65e4(0x1e3)](_0x271638,_0x18cc80[_0x4d65e4(0x181)]['id']))return;await _0x18cc80[_0x4d65e4(0x16c)]({'ephemeral':!![]});const _0x7b65aa=new Client2({'checkUpdate':![]});try{await _0x7b65aa[_0x4d65e4(0x137)](_0x357eff);}catch{return _0x18cc80[_0x4d65e4(0x270)](_0x3b5cd7[_0x4d65e4(0x244)]);}const _0x2614f3=_0x7b65aa[_0x4d65e4(0x16f)][_0x4d65e4(0x29e)][_0x4d65e4(0x203)](_0x2e42a5),_0x27f5f4=_0x7b65aa[_0x4d65e4(0x16f)][_0x4d65e4(0x29e)][_0x4d65e4(0x203)](_0x3f246d);if(!_0x2614f3)return _0x18cc80[_0x4d65e4(0x270)](_0x3b5cd7[_0x4d65e4(0x129)]);if(!_0x27f5f4)return _0x18cc80[_0x4d65e4(0x270)](_0x3b5cd7[_0x4d65e4(0x123)]);if(_0x3b5cd7[_0x4d65e4(0x1a7)](_0x2614f3['id'],_0x27f5f4['id'])||!_0x27f5f4[_0x4d65e4(0x158)]['me'][_0x4d65e4(0x197)+'s'][_0x4d65e4(0x1cd)](PermissionsBitField[_0x4d65e4(0x1ac)][_0x4d65e4(0x231)+_0x4d65e4(0x134)]))return _0x18cc80[_0x4d65e4(0x270)](_0x3b5cd7[_0x4d65e4(0x21d)]);await cooldowns2[_0x4d65e4(0x2af)](_0x18cc80[_0x4d65e4(0x181)]['id']),await _0x18cc80[_0x4d65e4(0x270)](_0x4d65e4(0x228)+'\x20'+recipientId+'\x20'+price+_0x4d65e4(0x240));let _0xc6341a=![];const _0x2532d3=_0x3b5cd7[_0x4d65e4(0x29c)](price,-0x1997+0xeac+-0xe9*-0xc)?0x1189+-0x19*-0x96+-0x202e:Math[_0x4d65e4(0x154)](_0x3b5cd7[_0x4d65e4(0x285)](price,0x880+0x2*0x8e4+-0x1a48+0.95)),_0x10d93c=_0x46c09c=>probot_ids[_0x4d65e4(0x237)](_0x46c09c[_0x4d65e4(0x182)]['id'])&&_0x46c09c[_0x4d65e4(0x17a)][_0x4d65e4(0x237)](''+_0x2532d3)&_0x46c09c[_0x4d65e4(0x17a)][_0x4d65e4(0x237)](''+recipientId)&&_0x46c09c[_0x4d65e4(0x17a)][_0x4d65e4(0x237)](''+_0x18cc80[_0x4d65e4(0x181)][_0x4d65e4(0x26a)]),_0x23eb6e=await _0x18cc80[_0x4d65e4(0x225)][_0x4d65e4(0x1e9)+_0x4d65e4(0x150)+'or']({'filter':_0x10d93c,'max':0x1,'time':0x493e0});_0x23eb6e[_0x4d65e4(0x1a4)](_0x3b5cd7[_0x4d65e4(0x167)],async()=>{const _0x45101c=_0x4d65e4;_0xc6341a=!![],_0x18cc80[_0x45101c(0x270)](_0x3b5cd7[_0x45101c(0x278)]);for(const [,_0xed0a89]of _0x27f5f4[_0x45101c(0x1ae)][_0x45101c(0x29e)]){await _0xed0a89[_0x45101c(0x26d)]()[_0x45101c(0x289)](()=>{});}for(const [,_0x3a6beb]of _0x27f5f4[_0x45101c(0x14c)][_0x45101c(0x29e)]){await _0x3a6beb[_0x45101c(0x26d)]()[_0x45101c(0x289)](()=>{});}for(const [,_0x3b6893]of _0x27f5f4[_0x45101c(0x2a6)][_0x45101c(0x29e)]){await _0x3b6893[_0x45101c(0x26d)]()[_0x45101c(0x289)](()=>{});}const _0x318fef=new Map(),_0xcb7179=new Map(),_0x2781d4=[..._0x2614f3[_0x45101c(0x14c)][_0x45101c(0x29e)][_0x45101c(0x274)]()][_0x45101c(0x12b)]((_0x1b75e4,_0x36b35e)=>_0x1b75e4[_0x45101c(0x21c)+'n']-_0x36b35e[_0x45101c(0x21c)+'n']),_0x4f2840=[..._0x2614f3[_0x45101c(0x1ae)][_0x45101c(0x29e)][_0x45101c(0x29f)](_0x104689=>_0x104689[_0x45101c(0x235)]===_0x45101c(0x20e)+_0x45101c(0x267))[_0x45101c(0x274)]()][_0x45101c(0x12b)]((_0x30ea08,_0x2a0e01)=>_0x30ea08[_0x45101c(0x21c)+'n']-_0x2a0e01[_0x45101c(0x21c)+'n']),_0x5ec7fb=[..._0x2614f3[_0x45101c(0x1ae)][_0x45101c(0x29e)][_0x45101c(0x29f)](_0x54197f=>_0x54197f[_0x45101c(0x235)]!==_0x45101c(0x20e)+_0x45101c(0x267))[_0x45101c(0x274)]()][_0x45101c(0x12b)]((_0x48e642,_0x1b2ac6)=>_0x48e642[_0x45101c(0x21c)+'n']-_0x1b2ac6[_0x45101c(0x21c)+'n']);for(const _0xaee702 of _0x2781d4){try{if(_0x3b5cd7[_0x45101c(0x110)](_0xaee702['id'],_0x2614f3[_0x45101c(0x14c)][_0x45101c(0x2c3)]['id'])){await _0x27f5f4[_0x45101c(0x14c)][_0x45101c(0x2c3)][_0x45101c(0x276)+_0x45101c(0x2dc)](_0xaee702[_0x45101c(0x197)+'s'][_0x45101c(0x1ff)]()),_0x18cc80[_0x45101c(0x225)][_0x45101c(0x2b5)](_0x3b5cd7[_0x45101c(0x1d3)]),_0x318fef[_0x45101c(0x2af)](_0xaee702['id'],_0x27f5f4[_0x45101c(0x14c)][_0x45101c(0x2c3)]);continue;}const _0x336fb7=await _0x27f5f4[_0x45101c(0x14c)][_0x45101c(0x15b)]({'name':_0xaee702[_0x45101c(0x1ed)],'position':_0xaee702[_0x45101c(0x21c)+'n'],'color':_0xaee702[_0x45101c(0x292)],'hoist':_0xaee702[_0x45101c(0x2fa)],'mentionable':_0xaee702[_0x45101c(0x152)+'e'],'permissions':_0xaee702[_0x45101c(0x197)+'s'][_0x45101c(0x1ff)]()});console[_0x45101c(0x204)](_0x45101c(0x186)+_0x45101c(0x20f)+_0x336fb7[_0x45101c(0x1ed)]),_0x318fef[_0x45101c(0x2af)](_0xaee702['id'],_0x336fb7);}catch{console[_0x45101c(0x11a)](_0x45101c(0x13e)+_0x45101c(0x22d)+_0x45101c(0x295)+_0xaee702[_0x45101c(0x1ed)]);}}_0x18cc80[_0x45101c(0x225)][_0x45101c(0x2b5)](_0x3b5cd7[_0x45101c(0x1d0)]);for(const _0x1a28df of _0x4f2840){try{const _0x9f4c2e=[];for(const [,_0x39e726]of _0x1a28df[_0x45101c(0x197)+_0x45101c(0x14e)][_0x45101c(0x29e)]){const _0x45b7b5=_0x318fef[_0x45101c(0x203)](_0x39e726['id']);_0x45b7b5&&_0x9f4c2e[_0x45101c(0x1e7)]({'id':_0x45b7b5['id'],'allow':_0x39e726[_0x45101c(0x2a8)][_0x45101c(0x1ff)](),'deny':_0x39e726[_0x45101c(0x232)][_0x45101c(0x1ff)]()});}const _0x4e605f=await _0x27f5f4[_0x45101c(0x1ae)][_0x45101c(0x15b)](_0x1a28df[_0x45101c(0x1ed)],{'type':_0x3b5cd7[_0x45101c(0x20a)],'permissionOverwrites':_0x9f4c2e});console[_0x45101c(0x204)](_0x45101c(0x238)+_0x45101c(0x17f)+_0x4e605f[_0x45101c(0x1ed)]),_0xcb7179[_0x45101c(0x2af)](_0x1a28df['id'],_0x4e605f);}catch{console[_0x45101c(0x11a)](_0x45101c(0x13e)+_0x45101c(0x215)+_0x45101c(0x216)+_0x1a28df[_0x45101c(0x1ed)]);}}_0x18cc80[_0x45101c(0x225)][_0x45101c(0x2b5)](_0x3b5cd7[_0x45101c(0x194)]);for(const _0x41b29b of _0x5ec7fb){try{const _0x68e627=[],_0x1a5827=_0x3b5cd7[_0x45101c(0x11e)](_0x41b29b[_0x45101c(0x235)],_0x3b5cd7[_0x45101c(0x13c)])?_0x3b5cd7[_0x45101c(0x13c)]:_0x3b5cd7[_0x45101c(0x298)](_0x41b29b[_0x45101c(0x235)],_0x3b5cd7[_0x45101c(0x26b)])?_0x3b5cd7[_0x45101c(0x26b)]:_0x3b5cd7[_0x45101c(0x13c)],_0x5d0045=_0x41b29b[_0x45101c(0x116)]?_0xcb7179[_0x45101c(0x203)](_0x41b29b[_0x45101c(0x116)]):null;for(const [,_0x3fb4ff]of _0x41b29b[_0x45101c(0x197)+_0x45101c(0x14e)][_0x45101c(0x29e)]){const _0x336d6b=_0x318fef[_0x45101c(0x203)](_0x3fb4ff['id']);_0x336d6b&&_0x68e627[_0x45101c(0x1e7)]({'id':_0x336d6b['id'],'allow':_0x3fb4ff[_0x45101c(0x2a8)][_0x45101c(0x1ff)](),'deny':_0x3fb4ff[_0x45101c(0x232)][_0x45101c(0x1ff)]()});}const _0x245e75=await _0x27f5f4[_0x45101c(0x1ae)][_0x45101c(0x15b)](_0x41b29b[_0x45101c(0x1ed)],{'type':_0x1a5827,'permissionOverwrites':_0x68e627,'parent':_0x5d0045});console[_0x45101c(0x204)](_0x45101c(0x1e8)+_0x45101c(0x233)+_0x245e75[_0x45101c(0x1ed)]);}catch{console[_0x45101c(0x11a)](_0x45101c(0x13e)+_0x45101c(0x26f)+_0x45101c(0x2ef)+_0x41b29b[_0x45101c(0x1ed)]);}}_0x18cc80[_0x45101c(0x225)][_0x45101c(0x2b5)](_0x3b5cd7[_0x45101c(0x2ed)]);for(const [,_0x28f79a]of _0x2614f3[_0x45101c(0x2a6)][_0x45101c(0x29e)]){const _0x332029=await _0x27f5f4[_0x45101c(0x2a6)][_0x45101c(0x15b)](_0x28f79a[_0x45101c(0x21b)],_0x28f79a[_0x45101c(0x1ed)]);console[_0x45101c(0x204)](_0x45101c(0x2b0)+_0x45101c(0x19a)+_0x332029[_0x45101c(0x1ed)]);}_0x18cc80[_0x45101c(0x2cf)+'y'](),cooldowns1[_0x45101c(0x26d)](_0x18cc80[_0x45101c(0x181)]['id']),cooldowns2[_0x45101c(0x26d)](_0x18cc80[_0x45101c(0x181)]['id']),_0x18cc80[_0x45101c(0x225)][_0x45101c(0x2b5)](_0x3b5cd7[_0x45101c(0x19c)]),_0x18cc80[_0x45101c(0x225)][_0x45101c(0x2b5)](_0x3b5cd7[_0x45101c(0x2a7)]);}),_0x23eb6e[_0x4d65e4(0x1a4)](_0x3b5cd7[_0x4d65e4(0x159)],()=>{const _0x3e0f66=_0x4d65e4;if(_0xc6341a)return;cooldowns1[_0x3e0f66(0x26d)](_0x18cc80[_0x3e0f66(0x181)]['id']),cooldowns2[_0x3e0f66(0x26d)](_0x18cc80[_0x3e0f66(0x181)]['id']),_0x18cc80[_0x3e0f66(0x270)](_0x3b5cd7[_0x3e0f66(0x2a9)]);});}if(_0x3b5cd7[_0x4d65e4(0x183)](_0x18cc80[_0x4d65e4(0x121)],_0x3b5cd7[_0x4d65e4(0x169)])&&!cooldowns1[_0x4d65e4(0x1cd)](_0x18cc80[_0x4d65e4(0x181)]['id'])){const _0x5758d5=new ModalBuilder()[_0x4d65e4(0x213)+'d'](_0x3b5cd7[_0x4d65e4(0x25a)])[_0x4d65e4(0x1b7)](_0x3b5cd7[_0x4d65e4(0x2a5)]),_0x35705f=new TextInputBuilder()[_0x4d65e4(0x213)+'d'](_0x3b5cd7[_0x4d65e4(0x2ee)])[_0x4d65e4(0x173)+'th'](-0x1*0x289+0x1925*0x1+-0x169b)[_0x4d65e4(0x286)+_0x4d65e4(0x243)](_0x3b5cd7[_0x4d65e4(0x15a)])[_0x4d65e4(0x2d2)](TextInputStyle[_0x4d65e4(0x1b6)])[_0x4d65e4(0x1d9)](_0x3b5cd7[_0x4d65e4(0x2c8)]),_0x4a8d89=new TextInputBuilder()[_0x4d65e4(0x213)+'d']('id')[_0x4d65e4(0x173)+'th'](-0x915+-0x1*-0xfcd+-0x6b7)[_0x4d65e4(0x286)+_0x4d65e4(0x243)](_0x3b5cd7[_0x4d65e4(0x142)])[_0x4d65e4(0x2d2)](TextInputStyle[_0x4d65e4(0x1b6)])[_0x4d65e4(0x1d9)](_0x3b5cd7[_0x4d65e4(0x2bc)]),_0x389748=new TextInputBuilder()[_0x4d65e4(0x213)+'d'](_0x3b5cd7[_0x4d65e4(0x2d7)])[_0x4d65e4(0x173)+'th'](0x7fc+-0x15ec+0xdf1)[_0x4d65e4(0x286)+_0x4d65e4(0x243)](_0x3b5cd7[_0x4d65e4(0x223)])[_0x4d65e4(0x2d2)](TextInputStyle[_0x4d65e4(0x1b6)])[_0x4d65e4(0x1d9)](_0x3b5cd7[_0x4d65e4(0x23f)]),_0x4732ae=new ActionRowBuilder()[_0x4d65e4(0x2c6)+_0x4d65e4(0x14d)](_0x35705f),_0x35c757=new ActionRowBuilder()[_0x4d65e4(0x2c6)+_0x4d65e4(0x14d)](_0x4a8d89),_0x1a5187=new ActionRowBuilder()[_0x4d65e4(0x2c6)+_0x4d65e4(0x14d)](_0x389748);_0x5758d5[_0x4d65e4(0x2c6)+_0x4d65e4(0x14d)](_0x4732ae,_0x35c757,_0x1a5187),_0x18cc80[_0x4d65e4(0x246)](_0x5758d5);}_0x3b5cd7[_0x4d65e4(0x1f1)](_0x18cc80[_0x4d65e4(0x121)],_0x3b5cd7[_0x4d65e4(0x146)])&&(cooldowns1[_0x4d65e4(0x26d)](_0x18cc80[_0x4d65e4(0x181)]['id']),cooldowns2[_0x4d65e4(0x26d)](_0x18cc80[_0x4d65e4(0x181)]['id']),_0x18cc80[_0x4d65e4(0x225)][_0x4d65e4(0x26d)]());}if(_0x18cc80[_0x4d65e4(0x1e5)+_0x4d65e4(0x259)]()){if(_0x3b5cd7[_0x4d65e4(0x183)](_0x18cc80[_0x4d65e4(0x121)],_0x3b5cd7[_0x4d65e4(0x25a)])&&!cooldowns1[_0x4d65e4(0x1cd)](_0x18cc80[_0x4d65e4(0x181)]['id'])){const _0x5950ac=_0x18cc80[_0x4d65e4(0x2c7)][_0x4d65e4(0x2cd)+_0x4d65e4(0x1ad)](_0x3b5cd7[_0x4d65e4(0x2ee)]),_0x206ec5=_0x18cc80[_0x4d65e4(0x2c7)][_0x4d65e4(0x2cd)+_0x4d65e4(0x1ad)]('id'),_0x4c723e=_0x18cc80[_0x4d65e4(0x2c7)][_0x4d65e4(0x2cd)+_0x4d65e4(0x1ad)](_0x3b5cd7[_0x4d65e4(0x2d7)]);await _0x18cc80[_0x4d65e4(0x16c)]({'ephemeral':!![]});const _0x57392a=new Client2({'checkUpdate':![]});try{await _0x57392a[_0x4d65e4(0x137)](_0x5950ac);}catch{return _0x18cc80[_0x4d65e4(0x270)](_0x3b5cd7[_0x4d65e4(0x296)]);}const _0x51d90b=_0x57392a[_0x4d65e4(0x16f)][_0x4d65e4(0x29e)][_0x4d65e4(0x203)](_0x206ec5),_0x5c565b=_0x57392a[_0x4d65e4(0x16f)][_0x4d65e4(0x29e)][_0x4d65e4(0x203)](_0x4c723e);if(!_0x51d90b)return _0x18cc80[_0x4d65e4(0x270)](_0x3b5cd7[_0x4d65e4(0x291)]);if(!_0x5c565b)return _0x18cc80[_0x4d65e4(0x270)](_0x3b5cd7[_0x4d65e4(0x2e4)]);if(_0x3b5cd7[_0x4d65e4(0x298)](_0x51d90b['id'],_0x5c565b['id'])||!_0x5c565b[_0x4d65e4(0x158)]['me'][_0x4d65e4(0x197)+'s'][_0x4d65e4(0x1cd)](PermissionsBitField[_0x4d65e4(0x1ac)][_0x4d65e4(0x231)+_0x4d65e4(0x134)]))return _0x18cc80[_0x4d65e4(0x270)](_0x3b5cd7[_0x4d65e4(0x21d)]);await cooldowns1[_0x4d65e4(0x2af)](_0x18cc80[_0x4d65e4(0x181)]['id']);const _0x249c37=new ActionRowBuilder()[_0x4d65e4(0x2c6)+_0x4d65e4(0x14d)](new ButtonBuilder()[_0x4d65e4(0x213)+'d'](_0x3b5cd7[_0x4d65e4(0x217)])[_0x4d65e4(0x2d2)](ButtonStyle[_0x4d65e4(0x239)])[_0x4d65e4(0x1d9)](_0x3b5cd7[_0x4d65e4(0x15c)]),new ButtonBuilder()[_0x4d65e4(0x213)+'d'](_0x3b5cd7[_0x4d65e4(0x146)])[_0x4d65e4(0x2d2)](ButtonStyle[_0x4d65e4(0x2b4)])[_0x4d65e4(0x1d9)](_0x3b5cd7[_0x4d65e4(0x248)])),_0x4ed113=await _0x18cc80[_0x4d65e4(0x270)]({'content':_0x4d65e4(0x1ea)+_0x4d65e4(0x272)+_0x4d65e4(0x2e8)+_0x51d90b[_0x4d65e4(0x1ed)]+'؟','components':[_0x249c37]});cooldowns[_0x4d65e4(0x2af)](_0x4ed113['id'],{'user':_0x18cc80[_0x4d65e4(0x181)]['id'],'token':_0x5950ac,'id':_0x206ec5,'id2':_0x4c723e});}}});const row=new ActionRowBuilder()[_0x55d093(0x2c6)+_0x55d093(0x14d)](new ButtonBuilder()[_0x55d093(0x213)+'d'](_0x55d093(0x1fe))[_0x55d093(0x2d2)](ButtonStyle[_0x55d093(0x239)])[_0x55d093(0x1d9)](_0x55d093(0x2be)),new ButtonBuilder()[_0x55d093(0x213)+'d'](_0x55d093(0x153))[_0x55d093(0x2d2)](ButtonStyle[_0x55d093(0x2b4)])[_0x55d093(0x1d9)](_0x55d093(0x2d6))),{category1}=require(_0x55d093(0x1d8)+_0x55d093(0x2d3));client['on'](_0x55d093(0x1a2)+_0x55d093(0x13a),_0x1f8261=>{const _0x3061ea=_0x55d093,_0x1f3606={'iRPox':_0x3061ea(0x15f),'iGlnL':_0x3061ea(0x231)+_0x3061ea(0x134),'wAQuy':_0x3061ea(0x25c)+_0x3061ea(0x205)+_0x3061ea(0x2c0)+_0x3061ea(0x2d1)+_0x3061ea(0x114)+_0x3061ea(0x18a)+_0x3061ea(0x1bc)+_0x3061ea(0x128)+_0x3061ea(0x14a)+_0x3061ea(0x22f),'EKKey':_0x3061ea(0x1c6),'wSwMR':_0x3061ea(0x2a4)+_0x3061ea(0x224)+_0x3061ea(0x2c1),'DzNcC':_0x3061ea(0x2b3)+_0x3061ea(0x143),'ISCXQ':_0x3061ea(0x122)};if(_0x1f8261[_0x3061ea(0x17a)][_0x3061ea(0x237)](_0x1f3606[_0x3061ea(0x172)])){if(_0x1f8261[_0x3061ea(0x251)][_0x3061ea(0x197)+'s'][_0x3061ea(0x1cd)](_0x1f3606[_0x3061ea(0x14f)])){const _0x789dee=new EmbedBuilder()[_0x3061ea(0x27b)]({'name':_0x1f8261[_0x3061ea(0x27c)][_0x3061ea(0x1ed)],'iconURL':_0x1f8261[_0x3061ea(0x27c)][_0x3061ea(0x2db)]()})[_0x3061ea(0x171)+_0x3061ea(0x1f3)](_0x3061ea(0x1c5)+_0x3061ea(0x22a)+_0x3061ea(0x293)+_0x3061ea(0x211)+_0x3061ea(0x28f)+_0x3061ea(0x2cb))[_0x3061ea(0x1cb)](_0x1f3606[_0x3061ea(0x290)])[_0x3061ea(0x147)]({'text':_0x1f8261[_0x3061ea(0x27c)][_0x3061ea(0x1ed)],'iconURL':_0x1f8261[_0x3061ea(0x27c)][_0x3061ea(0x2db)]()}),_0x23668d=new ActionRowBuilder()[_0x3061ea(0x2c6)+_0x3061ea(0x14d)](new StringSelectMenuBuilder()[_0x3061ea(0x213)+'d'](_0x1f3606[_0x3061ea(0x11d)])[_0x3061ea(0x286)+_0x3061ea(0x243)](_0x1f3606[_0x3061ea(0x138)])[_0x3061ea(0x24b)]([{'label':_0x1f3606[_0x3061ea(0x19e)],'value':'1'},{'label':_0x1f3606[_0x3061ea(0x17e)],'value':'2'}]));_0x1f8261[_0x3061ea(0x26d)](),_0x1f8261[_0x3061ea(0x225)][_0x3061ea(0x2b5)]({'embeds':[_0x789dee],'components':[_0x23668d]});}}});const pro=require(_0x55d093(0x17c));client['on'](_0x55d093(0x2a1)+_0x55d093(0x120),async _0x51bc5d=>{const _0x35e0aa=_0x55d093,_0xdaf4ab={'jZJgM':function(_0x43801b,_0x46e1b9){return _0x43801b===_0x46e1b9;},'ObYTH':_0x35e0aa(0x253),'hONCS':_0x35e0aa(0x2a1)+_0x35e0aa(0x120),'BTtDl':function(_0x40621f,_0x5bb879){return _0x40621f!==_0x5bb879;},'dmOBe':_0x35e0aa(0x1c6),'BcBJv':_0x35e0aa(0x17b),'fmxsF':_0x35e0aa(0x145)+'l','OZwKB':_0x35e0aa(0x26e)+'es'};if(!_0x51bc5d[_0x35e0aa(0x176)+_0x35e0aa(0x175)]())return;if(_0xdaf4ab[_0x35e0aa(0x2f7)](_0x51bc5d[_0x35e0aa(0x121)],_0xdaf4ab[_0x35e0aa(0x12c)]))return;if(_0xdaf4ab[_0x35e0aa(0x283)](_0x51bc5d[_0x35e0aa(0x274)][-0xe07+-0x1982+0x2789],'1')){const _0x467e1d=pro[_0x35e0aa(0x203)](_0x35e0aa(0x156)+_0x51bc5d[_0x35e0aa(0x181)]['id']);if(_0x51bc5d[_0x35e0aa(0x27c)][_0x35e0aa(0x1ae)][_0x35e0aa(0x29e)][_0x35e0aa(0x203)](_0x467e1d)&&_0x51bc5d[_0x35e0aa(0x27c)][_0x35e0aa(0x1ae)][_0x35e0aa(0x29e)][_0x35e0aa(0x203)](_0x467e1d)[_0x35e0aa(0x1ed)][_0x35e0aa(0x1f0)](_0xdaf4ab[_0x35e0aa(0x1b8)]))return _0x51bc5d[_0x35e0aa(0x19b)]({'content':_0x35e0aa(0x1eb)+_0x35e0aa(0x242)+_0x467e1d+'>','ephemeral':!![]});await _0x51bc5d[_0x35e0aa(0x27c)][_0x35e0aa(0x1ae)][_0x35e0aa(0x15b)]({'name':_0x35e0aa(0x22e)+_0x51bc5d[_0x35e0aa(0x181)][_0x35e0aa(0x26a)],'type':0x0,'parent':category1,'permissionOverwrites':[{'id':_0x51bc5d[_0x35e0aa(0x181)]['id'],'allow':[_0xdaf4ab[_0x35e0aa(0x1c8)],_0xdaf4ab[_0x35e0aa(0x1f2)]]},{'id':_0x51bc5d[_0x35e0aa(0x27c)][_0x35e0aa(0x14c)][_0x35e0aa(0x2c3)],'deny':[_0xdaf4ab[_0x35e0aa(0x1c8)]]}]})[_0x35e0aa(0x2b7)](async _0x51cc1f=>{const _0x13d920=_0x35e0aa,_0x4da7bc={'FUsbI':function(_0x4695d0,_0x4d11f8){const _0x55b5a8=_0x30f8;return _0xdaf4ab[_0x55b5a8(0x283)](_0x4695d0,_0x4d11f8);}},_0x52ca44=new EmbedBuilder()[_0x13d920(0x27b)]({'name':_0x51bc5d[_0x13d920(0x27c)][_0x13d920(0x1ed)],'iconURL':_0x51bc5d[_0x13d920(0x27c)][_0x13d920(0x2db)]()})[_0x13d920(0x24c)](_0xdaf4ab[_0x13d920(0x151)])[_0x13d920(0x171)+_0x13d920(0x1f3)](_0x13d920(0x18b)+_0x13d920(0x2f9)+_0x13d920(0x281)+_0x13d920(0x2f4)+_0x13d920(0x184)+_0x13d920(0x2d9)+_0x13d920(0x21a)+_0x13d920(0x13d)+_0x13d920(0x125))[_0x13d920(0x1ca)+'il'](_0x51bc5d[_0x13d920(0x181)][_0x13d920(0x1fa)+_0x13d920(0x2f8)]()),_0x2c64a5=new ActionRowBuilder()[_0x13d920(0x2c6)+_0x13d920(0x14d)](new ButtonBuilder()[_0x13d920(0x213)+'d']('hh')[_0x13d920(0x1d9)]('🤔')[_0x13d920(0x2d2)](ButtonStyle[_0x13d920(0x1dd)]));client['on'](_0xdaf4ab[_0x13d920(0x27a)],async _0x36ad89=>{const _0x37e26c=_0x13d920;_0x4da7bc[_0x37e26c(0x2e0)](_0x36ad89[_0x37e26c(0x121)],'hh')&&await _0x36ad89[_0x37e26c(0x19b)]({'content':_0x37e26c(0x13f)+_0x37e26c(0x266)+_0x37e26c(0x2e9)+_0x37e26c(0x2a2)+_0x37e26c(0x24f)+_0x37e26c(0x258)+_0x37e26c(0x1ec)+_0x37e26c(0x207)+_0x37e26c(0x2cc)+_0x37e26c(0x226)+_0x37e26c(0x29b)+_0x37e26c(0x2c9)+_0x37e26c(0x230)+_0x37e26c(0x1b1)+_0x37e26c(0x282)+_0x37e26c(0x117)+_0x37e26c(0x1f8)+_0x37e26c(0x17d)+_0x37e26c(0x16e)+_0x37e26c(0x257)+_0x37e26c(0x16b)+_0x37e26c(0x2d8)+_0x37e26c(0x28d)+_0x37e26c(0x1d6)+_0x37e26c(0x163)+_0x37e26c(0x16d)+_0x37e26c(0x11c)+_0x37e26c(0x2e7)+_0x37e26c(0x168)+_0x37e26c(0x2f6)+_0x37e26c(0x2f1)+_0x37e26c(0x1b0)+_0x37e26c(0x162)+_0x37e26c(0x1be)+_0x37e26c(0x2e2)+_0x37e26c(0x1f7)+_0x37e26c(0x174)+_0x37e26c(0x27d)+_0x37e26c(0x12d)+_0x37e26c(0x2ce)+_0x37e26c(0x198)+_0x37e26c(0x18c)+_0x37e26c(0x221)+_0x37e26c(0x2f5)+_0x37e26c(0x2bf)+_0x37e26c(0x1d2)+_0x37e26c(0x1dc)+_0x37e26c(0x2fc)+_0x37e26c(0x255)+'\x20','ephemeral':!![]});}),await _0x51cc1f[_0x13d920(0x2b5)]({'content':_0x51bc5d[_0x13d920(0x181)]+(_0x13d920(0x241)+_0x13d920(0x262)+_0x13d920(0x118)),'embeds':[_0x52ca44],'components':[row,_0x2c64a5]}),_0x51bc5d[_0x13d920(0x19b)]({'content':_0x13d920(0x210)+_0x13d920(0x27f)+_0x13d920(0x189)+_0x51cc1f,'ephemeral':!![]}),pro[_0x13d920(0x2af)](_0x13d920(0x156)+_0x51bc5d[_0x13d920(0x181)]['id'],_0x51cc1f['id']),pro[_0x13d920(0x2af)](_0x13d920(0x23b)+_0x51cc1f['id'],_0x51bc5d[_0x13d920(0x181)]['id']);});}});