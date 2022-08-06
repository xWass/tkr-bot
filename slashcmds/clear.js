const {SlashCommandBuilder}=require('@discordjs/builders');
const chalk=require('chalk');

module.exports={
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear an amount of messages from a channel')
    .addIntegerOption((option) => option
      .setName('amount')
      .setRequired(true)
      .setDescription('The number of messages to clear! 1-100')),
  async execute(interaction, client) {
    console.log(`${ chalk.greenBright('[EVENT ACKNOWLEDGED]') } interactionCreate with command clear`);
    const amount=interaction.options.getInteger('amount');
    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> You do not have the `MANAGE_MESSAGES` permission!');
      await interaction.reply({
        embeds: [{
          title: 'Error',
          description: 'You do not have the `MANAGE_MESSAGES` permission!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }

    if (!interaction.guild.me.permissions.has('MANAGE_MESSAGES')) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> I do not have the `MANAGE_MESSAGES` permission!');
      await interaction.reply({
        embeds: [{
          title: 'Error',
          description: 'I do not have the `MANAGE_MESSAGES` permission!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }

    if (amount===null) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> You did not specify a number of messages to clear!');
      await interaction.reply({
        embeds: [{
          title: 'Error',
          description: 'You did not specify a number of messages to clear!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }
    await interaction.channel.bulkDelete(amount);

    await interaction.followUp({
      embeds: [{
        title: 'Messages deleted!',
        description: `Deleted **${ amount }** messages.`,
        color: 'GREEN',
      }],
      ephemeral: false
    });
  },
};
