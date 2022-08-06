const {SlashCommandBuilder}=require('@discordjs/builders');
const chalk=require('chalk');
const ms=require('ms');

module.exports={
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Select a member and mute them.')

    .addUserOption((option) => option
      .setName('user')
      .setRequired(true)
      .setDescription('The member to mute.'))

    .addStringOption((option) => option
      .setName('time')
      .setRequired(true)
      .setDescription('Time to mute for. (1m, 1h, 1d, 1w. 28 days max)'))

    .addStringOption((option) => option
      .setName('reason')
      .setDescription('Reason for muting this user.')),

  async execute(interaction, client) {
    console.log(`${ chalk.greenBright('[EVENT ACKNOWLEDGED]') } interactionCreate with command mute`);
    const user=await interaction.options.getUser('user')||null;
    const mem=await interaction.options.getMember('user')||null;
    const res=await interaction.options.getString('reason')||'No reason specified.';
    const t=await interaction.options.getString('time');

    const tt=ms(t);

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
          description: 'I cannot mute this user!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }

    await mem.timeout(tt, res);
    await interaction.followUp({
      embeds: [{
        title: 'Success',
        description: `**${ user.tag }** has been muted.\nModerator: **${ interaction.user.tag }**\nDuration: **${ t }**\nReason: **${ res }**`,
        color: 'GREEN',
      }]
    });
  },
};
