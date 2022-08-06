const {SlashCommandBuilder}=require('@discordjs/builders');
const chalk=require('chalk');

module.exports={
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Select a member and ban them.')
    .addUserOption((option) => option
      .setName('user')
      .setRequired(true)
      .setDescription('The member to ban')),
  async execute(interaction, client) {
    console.log(`${ chalk.greenBright('[EVENT ACKNOWLEDGED]') } interactionCreate with command ban`);
    const user=interaction.options.getUser('user');
    const mem=interaction.options.getMember('user');
    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      await interaction.reply({
        embeds: [{
          title: 'Error',
          description: 'You do not have the `BAN_MEMBERS` permission!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }

    if (!interaction.guild.me.permissions.has('BAN_MEMBERS')) {
      await interaction.reply({
        embeds: [{
          title: 'Error',
          description: 'I do not have the `BAN_MEMBERS` permission!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }
    if (message.member.roles.highest.comparePositionTo(message.mentions.members.first().roles.highest)<0) {
      await message.reply({
        embeds: [{
          title: 'Error',
          description: 'This user has a higher role than you!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }

    if (!mem.bannable) {
      await interaction.reply({
        embeds: [{
          title: 'Error',
          description: 'I can not ban this user!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }
    await interaction.guild.members.ban(user.id);
    embed.setColor('GREEN');
    embed.setTitle('<:Success:949853804155793450> Member banned!');
    embed.setDescription(`**${ user.tag }** has been banned.\nModerator: **${ interaction.user.tag }**`);
    await interaction.followUp({
      embeds: [{
        title: 'Member banned!',
        description: `**${ user.tag }** has been banned.\nModerator: **${ interaction.user.tag }**`,
        color: 'GREEN',
      }],
      ephemeral: false
    });
  }
};
