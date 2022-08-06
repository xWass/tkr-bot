const ms=require('ms');
const chalk=require('chalk');

module.exports={
  name: 'mute',
  usage: 'mute',
  description: 'Mute a member.',
  async execute(client, message, args) {
    console.log(`${ chalk.greenBright('[EVENT ACKNOWLEDGED]') } messageCreate with content: ${ message.content }`);
    const mem=message.mentions.members.first();

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
          description: `I can not mute <@${ mem.id }> **[ ${ mem.id } ]**\nThis user most likely has a higher role than me or is the owner.`,
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
        }], ephemeral: true
      });
      return;
    }

    if (args[1]===undefined) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> You failed to provide a mute duration! \nFormat: ```1min, 1h, 1d```');
      await message.reply({
        embeds: [{
          title: 'Error',
          description: 'You failed to provide a mute duration! \nFormat: ```1min, 1h, 1d```',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }
    const t=args[1];
    const tt=ms(t);

    if (isNaN(tt)) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> You provided a duration in the incorrect format! \nFormat: ```1min, 1h, 1d```');
      await message.reply({
        embeds: [{
          title: 'Error',
          description: 'You provided a duration in the incorrect format! \nFormat: ```1min, 1h, 1d```',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }
    await mem.timeout(tt);
    await message.reply({
      embeds: [{
        title: 'Success',
        description: `${ mem.user.tag } has been muted.\nModerator: **${ message.author.tag }**\nDuration: **${ t }**`,
        color: 'GREEN',
      }],
      ephemeral: false
    });
  },
};
