const chalk = require('chalk');

module.exports = {
  name: 'unmute',
  usage: 'unmute',
  description: 'Unmute a member.',
  async execute(client, message, args) {
    console.log(`${chalk.greenBright('[EVENT ACKNOWLEDGED]')} messageCreate with content: ${message.content}`);
    const mem = message.mentions.members.first();
    if (!message.member.permissions.has('MODERATE_MEMBERS')) {
      await message.reply({
        embeds: [{
          title: 'Error',
          description: 'You do not have the `TIMEOUT_MEMBERS` permission!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }

    if (!message.guild.me.permissions.has('MODERATE_MEMBERS')) {
      await message.reply({
        embeds: [{
          title: 'Error',
          description: 'I do not have the `TIMEOUT_MEMBERS` permission!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }

    if (!mem) {
      await message.reply({
        embeds: [{
          title: 'Error',
          description: 'You failed to mention a member!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }

    if (!mem.moderatable) {
      await message.reply({
        embeds: [{
          title: 'Error',
          description: `I can not unmute <@${ mem.id }> **[ ${ mem.id } ]**\nThis user most likely has a higher role than me or is the owner.`,
          color: 'DARK_RED',
      }], ephemeral: true });
      return;
    }

    await mem.timeout(null);
    await message.reply({
      embeds: [{
        title: 'Success',
        description: `Successfully unmuted <@${ mem.id }> **[ ${ mem.id } ]**`,
        color: 'GREEN',
      }],
      ephemeral: false
    });
  },
};
