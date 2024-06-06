const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const { Database } = require("st.db");

const usersdata = new Database("/database/usersdata/usersdata");

module.exports = {

  data: new SlashCommandBuilder()

    .setName('daily')

    .setDescription('احصل على عدد عشوائي من العملات يوميًا'),

  async execute(interaction) {

    const userId = interaction.user.id;

    const lastDailyTimestamp = usersdata.get(`last_daily_${userId}_${interaction.guild.id}`) || 0;

    const currentDate = new Date();

    const difference = currentDate.getTime() - lastDailyTimestamp;

    if (difference >= 24 * 60 * 60 * 1000) {

      const randomCoins = Math.floor(Math.random() * 11) + 1;

      try {

        // تحديث رصيد المستخدم

        const userBalance = await usersdata.get(`balance_${userId}_${interaction.guild.id}`) || 0;

        const newUserBalance = userBalance + randomCoins;

        await usersdata.set(`balance_${userId}_${interaction.guild.id}`, newUserBalance);

        // تحديث الوقت الأخير الذي تم فيه استخدام اليوميات

        await usersdata.set(`last_daily_${userId}_${interaction.guild.id}`, currentDate.getTime());

        // إرسال رد

        const embed = new EmbedBuilder()

          .setDescription(`**Congratulations 🎊 You Taked ${randomCoins} Your Balance Now : \`${newUserBalance}\`**`)

          .setImage('https://cdn.discordapp.com/attachments/1176886003613565018/1180114035644059668/936220537540214794.jpg?ex=657c3dd7&is=6569c8d7&hm=83310ccf8b125b9ae79badc79b66196f12e0e1ee34e871125c32f6d8ece1b025&')

          .setColor(`#00FF00`)

          .setTimestamp();

        // التحقق من صلاحيات الرد

        const permissions = interaction.channel.permissionsFor(interaction.client.user);

        if (permissions && permissions.has('SEND_MESSAGES')) {

          // إرسال رسالة في الروم

          await interaction.reply({ embeds: [embed] });

        }

        // إرسال رسالة في الخاص

        const user = await interaction.client.users.fetch(userId);

        await user.send(`**Congratulations 🎊 You Taked ${randomCoins} Your Balance Now : \`${newUserBalance}\`**`);

      } catch (error) {

        console.error("Error updating user balance:", error);

        await interaction.reply('** حدثت مشكله اثناء تحديث رصيد حسابك .**');

      }

    } else {

      const remainingTime = calculateRemainingTime(24 * 60 * 60 * 1000 - difference);

      await interaction.reply({

        content: `** لا يمكنك استعمال هذا الامر الا بعد : ${remainingTime} .**`,

        ephemeral: true,

      });

    }

  },

};

function calculateRemainingTime(timeDifference) {

  const hours = Math.floor(timeDifference / (60 * 60 * 1000));

  const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));

  const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);

  return `${String(hours).padStart(2, '0')} ساعة و ${String(minutes).padStart(2, '0')} دقيقة و ${String(seconds).padStart(2, '0')} ثانية`;

}