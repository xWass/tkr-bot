const {SlashCommandBuilder}=require('@discordjs/builders');
const chalk=require('chalk');

module.exports={
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Select a member and kick them.')
    .addUserOption((option) => option
      .setName('user')
      .setRequired(true)
      .setDescription('The member to kick'))
    .addStringOption((option) => option
      .setName('reason')
      .setDescription('Reason for kicking this user.')),

  async execute(interaction, client) {
    console.log(`${ chalk.greenBright('[EVENT ACKNOWLEDGED]') } interactionCreate with command kick`);

    const user=interaction.options.getUser('user');
    const mem=interaction.options.getMember('user');
    const res=interaction.options.getString('reason')||null;

    if (!interaction.member.permissions.has('KICK_MEMBERS')) {
      await interaction.reply({
        embeds: [{
          title: 'Error',
          description: 'You do not have the `KICK_MEMBERS` permission!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }

    if (!interaction.guild.me.permissions.has('KICK_MEMBERS')) {
      await interaction.reply({
        embeds: [{
          title: 'Error',
          description: 'I do not have the `KICK_MEMBERS` permission!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }


    if (!mem.kickable) {
      await interaction.reply({
        embeds: [{
          title: 'Error',
          description: 'I cannot kick this user!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }

    await mem.kick(res);
    await interaction.reply({
      embeds: [{
        title: 'Success',
        description: `**${ user.tag }** has been kicked.\nModerator: **${ interaction.user.tag }**\nReason: **${ res }**`,
        color: 'GREEN',
      }]
    });
  },
};
