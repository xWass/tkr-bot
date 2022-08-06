const chalk=require('chalk');

module.exports={
  name: 'clear',
  usage: 'clear',
  description: 'Purge messages from a channel.',
  async execute(client, message, args) {
    console.log(`${ chalk.greenBright('[EVENT ACKNOWLEDGED]') } messageCreate with content: ${ message.content }`);

    const amount=args[0];

    if (!message.member.permissions.has('MANAGE_MESSAGES')) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> You do not have the `MANAGE_MESSAGES` permission!');
      await message.reply({
        embeds: [{
          title: 'Error',
          description: 'You do not have the `MANAGE_MESSAGES` permission!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }

    if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) {
      await message.reply({
        embeds: [{
          title: 'Error',
          description: 'I do not have the `MANAGE_MESSAGES` permission!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }

    if (!args[0]) {
      await message.reply({
        embeds: [{
          title: 'Error',
          description: 'You did not specify a number of messages to clear!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }
    await message.delete();
    const tot=Number(args[0])+1;
    await message.channel.bulkDelete(tot);

    await message.channel.send({
      embeds: [{
        title: 'Messages deleted!',
        description: `Deleted **${ amount }** messages.`,
        color: 'GREEN',
      }]
    });
  },
};
