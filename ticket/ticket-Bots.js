
  const { Client, Collection,AuditLogEvent, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const autolineDB = new Database("/Json-db/Bots/allDB.json")
const taxDB = new Database("/Json-db/Bots/allDB.json")
const logsDB = new Database("/Json-db/Bots/allDB.json")
const selfDB = new Database("/Json-db/Bots/allDB.json")
const allDB = new Database("/Json-db/Bots/allDB.json")
const feedbackDB = new Database("/Json-db/Bots/allDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")

let all = tokens.get('all')
if(!all) return;
const path = require('path');
const { readdirSync } = require("fs");
let theowner;
all.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client8 = new Client({intents: 32767, shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client8.commands = new Collection();
 require(`./handlers/events`)(client8);
  require(`./handlers/ticketClaim`)(client8);
  require(`./handlers/ticketCreate`)(client8);
  require(`./handlers/ticketDelete`)(client8);
  require(`./handlers/ticketSubmitCreate`)(client8);
  require(`./handlers/ticketUnclaim`)(client8);
  require(`./handlers/events`)(client8);
  client8.events = new Collection();
  require(`../../events/requireBots/all-commands`)(client8);
  const rest = new REST({ version: '10' }).setToken(token);
  client8.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client8.user.id),
          { body: allSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
    require(`./handlers/events`)(client8)
  const folderPath = path.join(__dirname, 'slashcommand8');
  client8.allSlashCommands = new Collection();
  const allSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("all commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          allSlashCommands.push(command.data.toJSON());
          client8.allSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'commands8');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/all-commands`)(client8)
require("./handlers/events")(client8)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client8.once(event.name, (...args) => event.execute(...args));
	} else {
		client8.on(event.name, (...args) => event.execute(...args));
	}
	}

client8.on('ready' , async() => {
  setInterval(async() => {
    let BroadcastTokenss = tokens.get(`all`)
    let thiss = BroadcastTokenss.find(br => br.token == token)
    if(thiss) {
      if(thiss.timeleft <= 0) {
        await client8.destroy();
        console.log(`${clientId} Ended`)
      }
    }
  }, 1000);
})


  client8.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client8.allSlashCommands.get(interaction.commandName);
	    
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


client8.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  let roomid = taxDB.get(`tax_room_${message.guild.id}`)
  let taxline = taxDB.get(`taxline_${message.guild.id}`)
  if (roomid) {
    if (message.channel.id == roomid) {
      if (message.author.bot) return;
      let number = message.content
      
      // تحقق مما إذا كانت الرسالة عشوائية أم لا
      if (!/^\d+[kmKM]?$/i.test(number)) {
        // إذا كانت الرسالة عشوائية، يتم حذفها وتجاهلها
        await message.delete();
        return;
      }
      
      // تحويل الأرقام المنتهية بـ "k" أو "m" إلى القيمة المقابلة
      if (number.endsWith("k") || number.endsWith("K")) {
        number = number.replace(/k/gi, "") * 1000;
      } else if (number.endsWith("m") || number.endsWith("M")) {
        number = number.replace(/m/gi, "") * 1000000;
      }
      
      let number2 = parseInt(number)
      let tax = Math.floor(number2 * (20) / (19) + 1) // المبلغ مع الضريبة
      let tax2 = Math.floor(tax - number2) // الضريبة
      let tax3 = Math.floor(tax * (20) / (19) + 1) // المبلغ مع ضريبة الوسيط
      let tax4 = Math.floor(tax3 - tax) // ضريبة الوسيط
      let embed1 = new EmbedBuilder()
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setTimestamp(Date.now())
        .setColor('#000000')

        .addFields([
          {
            name: `> **السعر بدون ضريبة**`,
            value: `**\`${number2}\`**`,
            inline: true
          },
          {
            name: `> **مبلغ الضريبة**`,
            value: `**\`${tax2}\`**`,
            inline: true
          },
          {
            name: `> **الضريبة**`,
            value: `**\`${tax}\`**`,
            inline: true
          }

        ])
      await message.reply({ embeds: [embed1] })
      await message.channel.send({ content: `${taxline}` })
    }
  }
})

  client8.on("messageCreate" , async(message) => {
  if(message.author.bot) return;
  try {
    if(message.content == "-" || message.content == "خط") {
      const line = autolineDB.get(`line_${message.guild.id}`)
      if(line) {
        await message.delete()
        return message.channel.send({content:`${line}`});
      }
    }
  } catch (error) {
    return;
  }
 
})

client8.on("messageCreate" , async(message) => {
  if(message.author.bot) return;
  const autoChannels = autolineDB.get(`line_channels_${message.guild.id}`)
    if(autoChannels) {
      if(autoChannels.length > 0) {
        if(autoChannels.includes(message.channel.id)) {
          const line = autolineDB.get(`line_${message.guild.id}`)
      if(line) {
        return message.channel.send({content:`${line}`});
        }
      }
      }
    }
})

client8.on('messageDelete' , async(message) => {
      if(!message) return;
      if(!message.author) return;
      if(message.author.bot) return;
    if (!logsDB.has(`log_messagedelete_${message.guild.id}`)) return;
    let deletelog1 = logsDB.get(`log_messagedelete_${message.guild.id}`)
      let deletelog2 = message.guild.channels.cache.get(deletelog1)
      const fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MessageDelete
      });
      const deletionLog = fetchedLogs.entries.first();
      const { executor, target } = deletionLog;
    let deleteembed = new EmbedBuilder()
    .setTitle(`**تم حذف رسالة**`)
        .addFields(
          {
            name: `**صاحب الرسالة : **`, value: `**\`\`\`${message.author.tag} - (${message.author.id})\`\`\`**`, inline: false
          },
          {
            name: `**حاذف الرسالة : **`, value: `**\`\`\`${executor.username} - (${executor.id})\`\`\`**`, inline: false
          },
          {
            name: `**محتوى الرسالة : **`, value: `**\`\`\`${message.content}\`\`\`**`, inline: false
          },
          {
            name: `**الروم الذي تم الحذف فيه : **`, value: `${message.channel}`, inline: false
          }
        )
        .setTimestamp();
      await deletelog2.send({ embeds: [deleteembed] })
  })
client8.on('messageUpdate' , async(oldMessage, newMessage) => {
    if(!oldMessage.author) return;
    if(oldMessage.author.bot) return;
  if (!logsDB.has(`log_messageupdate_${oldMessage.guild.id}`)) return;
  const fetchedLogs = await oldMessage.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.MessageUpdate
  });
  let updateLog1 = logsDB.get(`log_messageupdate_${oldMessage.guild.id}`);
      let updateLog2 = oldMessage.guild.channels.cache.get(updateLog1); 
  const updateLog = fetchedLogs.entries.first();
  const { executor } = updateLog;
  let updateEmbed = new EmbedBuilder()
  .setTitle(`**تم تعديل رسالة**`)
  .addFields(
    {
      name: "**صاحب الرسالة:**",
      value: `**\`\`\`${oldMessage.author.tag} (${oldMessage.author.id})\`\`\`**`,
      inline: false
    },
    {
      name: "**المحتوى القديم:**",
      value: `**\`\`\`${oldMessage.content}\`\`\`**`,
      inline: false
    },
    {
      name: "**المحتوى الجديد:**",
      value: `**\`\`\`${newMessage.content}\`\`\`**`,
      inline: false
    },
    {
      name: "**الروم الذي تم التحديث فيه:**",
      value: `${oldMessage.channel}`,
      inline: false
    }
  )
  .setTimestamp()
  await updateLog2.send({ embeds: [updateEmbed] });
})
client8.on('roleCreate' , async(role) => {
  if (!logsDB.has(`log_rolecreate_${role.guild.id}`)) return;
  let roleCreateLog1 = logsDB.get(`log_rolecreate_${role.guild.id}`);
      let roleCreateLog2 = role.guild.channels.cache.get(roleCreateLog1);
      const fetchedLogs = await role.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleCreate
      });
      const roleCreateLog = fetchedLogs.entries.first();
      const { executor } = roleCreateLog;
      let roleCreateEmbed = new EmbedBuilder()
        .setTitle('**تم انشاء رتبة**')
        .addFields(
          { name: 'اسم الرتبة :', value: `\`\`\`${role.name}\`\`\``, inline: true },
          { name: 'الذي قام بانشاء الرتبة :', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: true }
        )
        .setTimestamp();
      await roleCreateLog2.send({ embeds: [roleCreateEmbed] });
})
client8.on('roleDelete' , async(role) => {
  if (!logsDB.has(`log_roledelete_${role.guild.id}`)) return;
  let roleDeleteLog1 = logsDB.get(`log_roledelete_${role.guild.id}`);
      let roleDeleteLog2 = role.guild.channels.cache.get(roleDeleteLog1);
      const fetchedLogs = await role.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleDelete
      });

      const roleDeleteLog = fetchedLogs.entries.first();
      const { executor } = roleDeleteLog;

      let roleDeleteEmbed = new EmbedBuilder()
        .setTitle('**تم حذف رتبة**')
        .addFields({name:'اسم الرتبة :', value:`\`\`\`${role.name}\`\`\``, inline:true},{name:'الذي قام بحذف الرتبة :', value:`\`\`\`${executor.username} (${executor.id})\`\`\``, inline:true})
        .setTimestamp();

      await roleDeleteLog2.send({ embeds: [roleDeleteEmbed] });
})




client8.on('channelCreate', async (channel) => {
  if (logsDB.has(`log_channelcreate_${channel.guild.id}`)) {
    let channelCreateLog1 = logsDB.get(`log_channelcreate_${channel.guild.id}`);
    let channelCreateLog2 = channel.guild.channels.cache.get(channelCreateLog1);




    const fetchedLogs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.ChannelCreate
    });

    const channelCreateLog = fetchedLogs.entries.first();
    const { executor } = channelCreateLog;

    let channelCategory = channel.parent ? channel.parent.name : 'None';

    let channelCreateEmbed = new EmbedBuilder()
      .setTitle('**تم انشاء روم**')
      .addFields(
        { name: 'اسم الروم : ', value: `\`\`\`${channel.name}\`\`\``, inline: true },
        { name: 'كاتيجوري الروم : ', value: `\`\`\`${channelCategory}\`\`\``, inline: true },
        { name: 'الذي قام بانشاء الروم : ', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: true }
      )
      .setTimestamp();

    await channelCreateLog2.send({ embeds: [channelCreateEmbed] });
  }
});




client8.on('channelDelete', async (channel) => {
  if (logsDB.has(`log_channeldelete_${channel.guild.id}`)) {
    let channelDeleteLog1 = logsDB.get(`log_channeldelete_${channel.guild.id}`);
    let channelDeleteLog2 = channel.guild.channels.cache.get(channelDeleteLog1);




    const fetchedLogs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.ChannelDelete
    });

    const channelDeleteLog = fetchedLogs.entries.first();
    const { executor } = channelDeleteLog;

    let channelDeleteEmbed = new EmbedBuilder()
      .setTitle('**تم حذف روم**')
      .addFields(
        { name: 'اسم الروم : ', value: `\`\`\`${channel.name}\`\`\``, inline: true },
        { name: 'الذي قام بحذف الروم : ', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: true }
      )
      .setTimestamp();

    await channelDeleteLog2.send({ embeds: [channelDeleteEmbed] });
  }
});

client8.on('guildMemberUpdate', async (oldMember, newMember) => {
  const guild = oldMember.guild;
const addedRoles = newMember.roles.cache.filter((role) => !oldMember.roles.cache.has(role.id));
const removedRoles = oldMember.roles.cache.filter((role) => !newMember.roles.cache.has(role.id));




if (addedRoles.size > 0 && logsDB.has(`log_rolegive_${guild.id}`)) {
    let roleGiveLog1 = logsDB.get(`log_rolegive_${guild.id}`);
    let roleGiveLog2 = guild.channels.cache.get(roleGiveLog1);

    const fetchedLogs = await guild.fetchAuditLogs({
      limit: addedRoles.size,
      type: AuditLogEvent.MemberRoleUpdate
    });

    addedRoles.forEach((role) => {
      const roleGiveLog = fetchedLogs.entries.find((log) => log.target.id === newMember.id && log.changes[0].new[0].id === role.id);
      const roleGiver = roleGiveLog ? roleGiveLog.executor : null;
      const roleGiverUsername = roleGiver ? `${roleGiver.username} (${roleGiver.id})` : `UNKNOWN`;



      let roleGiveEmbed = new EmbedBuilder()
        .setTitle('**تم إعطاء رتبة لعضو**')
        .addFields(
          { name: 'اسم الرتبة:', value: `\`\`\`${role.name}\`\`\``, inline: true },
          { name: 'تم إعطاءها بواسطة:', value: `\`\`\`${roleGiverUsername}\`\`\``, inline: true },
          { name: 'تم إعطائها للعضو:', value: `\`\`\`${newMember.user.username} (${newMember.user.id})\`\`\``, inline: true }
        )
        .setTimestamp();

      roleGiveLog2.send({ embeds: [roleGiveEmbed] });
    });
  }

  if (removedRoles.size > 0 && logsDB.has(`log_roleremove_${guild.id}`)) {
    let roleRemoveLog1 = logsDB.get(`log_roleremove_${guild.id}`);
    let roleRemoveLog2 = guild.channels.cache.get(roleRemoveLog1);

    const fetchedLogs = await guild.fetchAuditLogs({
      limit: removedRoles.size,
      type: AuditLogEvent.MemberRoleUpdate
    });




    removedRoles.forEach((role) => {
      const roleRemoveLog = fetchedLogs.entries.find((log) => log.target.id === newMember.id && log.changes[0].new[0].id === role.id);
      const roleRemover = roleRemoveLog ? roleRemoveLog.executor : null;
      const roleRemoverUsername = roleRemover ? `${roleRemover.username} (${roleRemover.id})` : `UNKNOWN`;

      let roleRemoveEmbed = new EmbedBuilder()
        .setTitle('**تم إزالة رتبة من عضو**')
        .addFields(
          { name: 'اسم الرتبة:', value: `\`\`\`${role.name}\`\`\``, inline: true },
          { name: 'تم إزالتها بواسطة:', value: `\`\`\`${roleRemoverUsername}\`\`\``, inline: true },
          { name: 'تم إزالتها من العضو:', value: `\`\`\`${newMember.user.username} (${newMember.user.id})\`\`\``, inline: true }
        )
        .setTimestamp();


      roleRemoveLog2.send({ embeds: [roleRemoveEmbed] });
    });
  }
});
client8.on('guildMemberAdd', async (member) => {
  const guild = member.guild;
  if(!member.bot) return;
  const fetchedLogs = await guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.BotAdd
  });




  const botAddLog = fetchedLogs.entries.first();
  const { executor, target } = botAddLog;

  if (target.bot) {
    let botAddLog1 = logsDB.get(`log_botadd_${guild.id}`);
    let botAddLog2 = guild.channels.cache.get(botAddLog1);

    let botAddEmbed = new EmbedBuilder()
      .setTitle('**تم اضافة بوت جديد الى السيرفر**')
      .addFields(
        { name: 'اسم البوت :', value: `\`\`\`${member.user.username}\`\`\``, inline: true },
        { name: 'ايدي البوت :', value: `\`\`\`${member.user.id}\`\`\``, inline: true },
        { name: 'هل لديه صلاحية الادمن ستريتور ؟ :', value: member.permissions.has('ADMINISTRATOR') ? `\`\`\`نعم لديه\`\`\`` : `\`\`\`لا ليس لديه\`\`\``, inline: true },
        { name: 'تم اضافته بواسطة :', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: false }
      )
      .setTimestamp();

    botAddLog2.send({ embeds: [botAddEmbed] });
  }
});





client8.on('guildBanAdd', async (guild, user) => {
  if (logsDB.has(`log_banadd_${guild.id}`)) {
    let banAddLog1 = logsDB.get(`log_banadd_${guild.id}`);
    let banAddLog2 = guild.channels.cache.get(banAddLog1);

    const fetchedLogs = await guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberBanAdd
    });

    const banAddLog = fetchedLogs.entries.first();
    const banner = banAddLog ? banAddLog.executor : null;
    const bannerUsername = banner ? `\`\`\`${banner.username} (${banner.id})\`\`\`` : `\`\`\`UNKNOWN\`\`\``;


    let banAddEmbed = new EmbedBuilder()
      .setTitle('**تم حظر عضو**')
      .addFields(
        { name: 'العضو المحظور:', value: `\`\`\`${user.tag} (${user.id})\`\`\`` },
        { name: 'تم حظره بواسطة:', value: bannerUsername },
      )
      .setTimestamp();

    banAddLog2.send({ embeds: [banAddEmbed] });
  }
});




client8.on('guildBanRemove', async (guild, user) => {
  if (logsDB.has(`log_bandelete_${guild.id}`)) {
    let banRemoveLog1 = logsDB.get(`log_bandelete_${guild.id}`);
    let banRemoveLog2 = guild.channels.cache.get(banRemoveLog1);

    const fetchedLogs = await guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberBanRemove
    });

    const banRemoveLog = fetchedLogs.entries.first();
    const unbanner = banRemoveLog ? banRemoveLog.executor : null;
    const unbannerUsername = unbanner ? `\`\`\`${unbanner.username} (${unbanner.id})\`\`\`` : `\`\`\`UNKNOWN\`\`\``;

    let banRemoveEmbed = new EmbedBuilder()
      .setTitle('**تم إزالة حظر عضو**')
      .addFields(
        { name: 'العضو المفكّر الحظر عنه:', value: `\`\`\`${user.tag} (${user.id})\`\`\`` },
        { name: 'تم إزالة الحظر بواسطة:', value: unbannerUsername }
      )
      .setTimestamp();


    banRemoveLog2.send({ embeds: [banRemoveEmbed] });
  }
});


client8.on('guildMemberRemove', async (member) => {
  const guild = member.guild;
  if (logsDB.has(`log_kickadd_${guild.id}`)) {
    const kickLogChannelId = logsDB.get(`log_kickadd_${guild.id}`);
    const kickLogChannel = guild.channels.cache.get(kickLogChannelId);

    const fetchedLogs = await guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberKick,
    });

    const kickLog = fetchedLogs.entries.first();
    const kicker = kickLog ? kickLog.executor : null;
    const kickerUsername = kicker ? `\`\`\`${kicker.username} (${kicker.id})\`\`\`` : 'Unknown';

    const kickEmbed = new EmbedBuilder()
      .setTitle('**تم طرد عضو**')
      .addFields(
        { name: 'العضو المطرود:', value: `\`\`\`${member.user.tag} (${member.user.id})\`\`\`` },
        { name: 'تم طرده بواسطة:', value: kickerUsername },
      )
      .setTimestamp();

    kickLogChannel.send({ embeds: [kickEmbed] });
  }
});


client8.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'role1') { // التحقق من ايدي الزر
            const member = interaction.member;


            try {
                const roleId = await selfDB.get(`role1_${interaction.guildId}`); // تغيير الاسم من creditDB إلى selfDB
                if (!roleId) {
                    return console.error('**لم يتم تعيين الرولات لهذا السيرفر بعد**');
                }

                const role = interaction.guild.roles.cache.get(roleId);

                if (!role) {
                    return console.error('**الرول غير موجود**');
                }

                await member.roles.add(role);
                await interaction.reply({ content: '**تم إعطاؤك الرول بنجاح!**', ephemeral: true });
            } catch (error) {
                console.error('فشل في إضافة الدور:', error);
                await interaction.reply({ content: '**يرجى التأكد ان رتبة البوت اعلى من الرتبة المحددة**', ephemeral: true });
            }
        }
    });

client8.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'role2') { // التحقق من ايدي الزر
            const member = interaction.member;


            try {
                const roleId = await selfDB.get(`role2_${interaction.guildId}`); // تغيير الاسم من creditDB إلى selfDB
                if (!roleId) {
                    return console.error('**لم يتم تعيين الرولات لهذا السيرفر بعد**');
                }

                const role = interaction.guild.roles.cache.get(roleId);

                if (!role) {
                    return console.error('**الرول غير موجود**');
                }

                await member.roles.add(role);
                await interaction.reply({ content: '**تم إعطاؤك الرول بنجاح!**', ephemeral: true });
            } catch (error) {
                console.error('فشل في إضافة الدور:', error);
                await interaction.reply({ content: '**يرجى التأكد ان رتبة البوت اعلى من الرتبة المحددة**', ephemeral: true });
            }
        }
    });

client8.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'role3') { // التحقق من ايدي الزر
            const member = interaction.member;


            try {
                const roleId = await selfDB.get(`role3_${interaction.guildId}`); // تغيير الاسم من creditDB إلى selfDB
                if (!roleId) {
                    return console.error('**لم يتم تعيين الرولات لهذا السيرفر بعد**');
                }

                const role = interaction.guild.roles.cache.get(roleId);

                if (!role) {
                    return console.error('**الرول غير موجود**');
                }

                await member.roles.add(role);
                await interaction.reply({ content: '**تم إعطاؤك الرول بنجاح!**', ephemeral: true });
            } catch (error) {
                console.error('فشل في إضافة الدور:', error);
                await interaction.reply({ content: '**يرجى التأكد ان رتبة البوت اعلى من الرتبة المحددة**', ephemeral: true });
            }
        }
    });

client8.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'role4') { // التحقق من ايدي الزر
            const member = interaction.member;


            try {
                const roleId = await selfDB.get(`role4_${interaction.guildId}`); // تغيير الاسم من creditDB إلى selfDB
                if (!roleId) {
                    return console.error('**لم يتم تعيين الرولات لهذا السيرفر بعد**');
                }

                const role = interaction.guild.roles.cache.get(roleId);

                if (!role) {
                    return console.error('**الرول غير موجود**');
                }

                await member.roles.add(role);
                await interaction.reply({ content: '**تم إعطاؤك الرول بنجاح!**', ephemeral: true });
            } catch (error) {
                console.error('فشل في إضافة الدور:', error);
                await interaction.reply({ content: '**يرجى التأكد ان رتبة البوت اعلى من الرتبة المحددة**', ephemeral: true });
            }
        }
    });




   client7.login(token)
   .catch(async(err) => {
    const filtered = all.filter(bo => bo != data)
			await tokens.set(`all` , filtered)
      console.log(`${clientId} Not working and removed `)
   });
})