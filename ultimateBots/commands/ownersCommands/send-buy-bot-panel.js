const { SlashCommandBuilder,SelectMenuBuilder,StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/database/data")
const setting = new Database("/database/settingsdata/setting")

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('send-buy-bot-panel')
    .setDescription(`ارسال بانل شراء البوتات`),
async execute(interaction) {
    await interaction.deferReply({ephemeral:false})
    let price1 = await setting.get(`balance_price_${interaction.guild.id}`) ?? 5000;
    let recipient = await setting.get(`recipient_${interaction.guild.id}`)
    let transferroom = await setting.get(`transfer_room_${interaction.guild.id}`)
    let logroom =  await setting.get(`log_room_${interaction.guild.id}`)
    let probot = await setting.get(`probot_${interaction.guild.id}`)
    let clientrole = await setting.get(`client_role_${interaction.guild.id}`)
    let panelroom = await setting.get(`panel_room_${interaction.guild.id}`)
    let buybotroom = await setting.get(`buy_bot_room${interaction.guild.id}`)
    if(!price1 || !recipient || !transferroom || !logroom || !probot || !clientrole || !buybotroom) return interaction.editReply({content:`**لم يتم تحديد الاعدادات**`})
    let theroom = interaction.guild.channels.cache.find(ch => ch.id == buybotroom)
    let embed = new EmbedBuilder()
    .setTitle(`**بانل شراء بوت**`)
    .setDescription(`**يمكنك شراء بوت عن طريق الضغط على البوت من القائمة**`)
    .setTimestamp()
    const select = new StringSelectMenuBuilder()
    .setCustomId('select_bot')
    .setPlaceholder('قم بأختيار البوت من القائمة')
    .addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel('تــقــدڀــمــات')
            .setDescription('شــراء بــوت تــقــدڀــمــات')
.setEmoji('🧾')
            .setValue('BuyApply'),
            new StringSelectMenuOptionBuilder()
            .setLabel('ڂــط  تــلــڦــائــي')
            .setDescription('شــراء بــوت ڂــط  تــلــڦــائــي')
.setEmoji('🖌️')
            .setValue('BuyAutoline'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بــلاك لــيــســت')
            .setDescription('شــراء بــوت بــلاك لــيــســت')
.setEmoji('📛')
            .setValue('BuyBlacklist'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بــرودكـا̍ســت')
            .setDescription('شــراء بــوت بــرودكـا̍ســت ּ')
.setEmoji('📢')
            .setValue('BuyBroadcast'),
        new StringSelectMenuOptionBuilder()
            .setLabel('بــرودكـا̍ســت ּعـادي')
            .setDescription('شــراء بــوت بــرودكـا̍ســت ּعـادي')
.setEmoji('📣')
            .setValue('BuyNormalBroadcast'),
            new StringSelectMenuOptionBuilder()
            .setLabel('كــريــدت')
            .setDescription('شــراء بــوت كــريــدت وهــمــي')
.setEmoji('💰')
            .setValue('BuyCredit'),
            new StringSelectMenuOptionBuilder()
            .setLabel('اراء')
            .setDescription('شــراء بــوت اراء')
.setEmoji('🗯️')
            .setValue('BuyFeedback'),
            new StringSelectMenuOptionBuilder()
            .setLabel('جــيــف اوي')
            .setDescription('شــراء بــوت جــيــف اوي')
.setEmoji('🎉')
            .setValue('BuyGiveaway'),
            new StringSelectMenuOptionBuilder()
            .setLabel('لــوج')
            .setDescription('شــراء بــوت لــوج')
.setEmoji('🌐')
            .setValue('BuyLogs'),
            new StringSelectMenuOptionBuilder()
            .setLabel('نـا̍ديــكــو')
            .setDescription('شــراء بــوت نـا̍ديــكــو')
.setEmoji('🎃')
            .setValue('BuyNadeko'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بــروبــوت')
            .setDescription('شــراء بــوت  بــروبــوت بــريــمــيــوم ')
.setEmoji('🤖')
            .setValue('BuyProbot'),
            new StringSelectMenuOptionBuilder()
            .setLabel('جــمـايــة')
            .setDescription('شــراء بــوت جــمـايــة')
.setEmoji('🚷')
            .setValue('BuyProtect'),
            new StringSelectMenuOptionBuilder()
            .setLabel('نــصـابــيــن')
            .setDescription('شــراء بــوت نــصـابــيــن')
.setEmoji('♿')
            .setValue('BuyScammers'),
            new StringSelectMenuOptionBuilder()
            .setLabel('اقــتــراحـات')
            .setDescription('شــراء بــوت اقــتــراحـات')
.setEmoji('💬')
            .setValue('BuySuggestions'),
            new StringSelectMenuOptionBuilder()
            .setLabel('ســيــســتــم')
            .setDescription('شــراء بــوت ســيــســتــم')
.setEmoji('⚙️')
            .setValue('BuySystem'),
            new StringSelectMenuOptionBuilder()
            .setLabel('̨ضــريــبــة')
            .setDescription('شــراء بــوت ̨ضــريــبــة')
.setEmoji('📊')
            .setValue('BuyTax'),
            new StringSelectMenuOptionBuilder()
            .setLabel('تــكــت')
            .setDescription('شــراء بــوت تــكــت')
.setEmoji('🎟️')
            .setValue('BuyTicket'),
            new StringSelectMenuOptionBuilder()
            .setLabel('اﻋـادۃ ۛتــعــيــيــن')
            .setDescription('̨ﻋــمــل اﻋـادۃ ۛتــعــيــيــن لــلاخــتــيـار')
.setEmoji('🔧')
            .setValue('Reset_Selected'),
    );
    const row = new ActionRowBuilder()
    .addComponents(select);
    theroom.send({embeds:[embed] , components:[row]})
    if(setting.has(`subscribe_room_${interaction.guild.id}`)) {
        let subscriberoo = setting.get(`subscribe_room_${interaction.guild.id}`)
        let subscriberoom = interaction.guild.channels.cache.find(ch => ch.id == subscriberoo)
        let embed2 = new EmbedBuilder()
    .setTitle(`**بانل اشتراك في بوت الميكر**`)
    .setDescription(`**يمكنك الاشتراك في بوت الميكر عن طريق القائمة**`)
    .setTimestamp()
        const select2 = new StringSelectMenuBuilder()
        .setCustomId('select_bot')
        .setPlaceholder('الاشتراك في بوت الميكر')
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel('بــرايــم')
            .setDescription('ألأشــتــراك فــي بــوت الــمــيــكــر بــرايــم')
.setEmoji('💍')
            .setValue('Bot_Maker_Subscribe'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بــريــمــيــوم')
            .setDescription('ألأشــتــراك فــي بــوت الــمــيــكــر بــريــمــيــوم')
.setEmoji('💎')
            .setValue('Bot_Maker_Premium_Subscribe'),
            new StringSelectMenuOptionBuilder()
            .setLabel('الــتــيــمــيــت')
            .setDescription('ألأشــتــراك فــي بــوت الــمــيــكــر ̨الــتــيــمــيــت')
.setEmoji('👑')
            .setValue('Bot_Maker_Ultimate_Subscribe'),
            new StringSelectMenuOptionBuilder()
            .setLabel('اﻋـادۃ ۛتــعــيــيــن')
            .setDescription('عــمــل اﻋـادۃ ۛتــعــيــيــن لــلاخــتــيـار')
.setEmoji('🔧')
            .setValue('Reset_Selected'),);
            const row2 = new ActionRowBuilder().addComponents(select2)
        subscriberoom.send({embeds:[embed2],components:[row2]})
    }
    return interaction.editReply({content:`**تم ارسال الرسالة بنجاح**`})
}
}