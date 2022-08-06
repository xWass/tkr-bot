const { SlashCommandBuilder } = require('@discordjs/builders');
const chalk = require('chalk');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Select a member and unmute them.')

    .addUserOption((option) => option
      .setName('user')
      .setRequired(true)
      .setDescription('The member to unmute.')),

  async execute(interaction) {
    console.log(`${chalk.greenBright('[EVENT ACKNOWLEDGED]')} interactionCreate with command unmute`);
    const user = await interaction.options.getUser('user') || null;
    const mem = await interaction.options.getMember('user') || null;

    if (!interaction.member.permissions.has('MODERATE_MEMBERS')) {
      await interaction.reply({
        embeds: [{
          title: 'Error',
          description: 'You do not have the `TIMEOUT_MEMBERS` permission!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }

    if (!interaction.guild.me.permissions.has('MODERATE_MEMBERS')) {
      embed.setColor('DARK_RED');
      embed.setTitle('<:Error:949853701504372778> I do not have the `TIMEOUT_MEMBERS` permission!');
      await interaction.reply({
        embeds: [{
          title: 'Error',
          description: 'I do not have the `TIMEOUT_MEMBERS` permission!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }

    if (!mem.moderatable) {
      await interaction.reply({
        embeds: [{
          title: 'Error',
          description: 'I cannot unmute this user!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }
    await mem.timeout(null);
    await interaction.reply({
      embeds: [{
        title: 'Success',
        description: `**${ user.tag }** has been unmuted.\nModerator: **${ interaction.user.tag }**`,
        color: 'GREEN',
      }]
    });
  },
};
