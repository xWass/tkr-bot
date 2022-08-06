const chalk=require('chalk');

module.exports={
  name: 'kick',
  usage: 'kick',
  description: 'Kick a member.',
  async execute(client, message, args) {
    console.log(`${ chalk.greenBright('[EVENT ACKNOWLEDGED]') } messageCreate with content: ${ message.content }`);
    const mem=message.mentions.members.first();

    if (!message.member.permissions.has('KICK_MEMBERS')) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> You do not have the `KICK_MEMBERS` permission!');
      await message.reply({
        embeds: [{
          title: 'Error',
          description: 'You do not have the `KICK_MEMBERS` permission!',
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }

    if (!message.guild.me.permissions.has('KICK_MEMBERS')) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> I do not have the `KICK_MEMBERS` permission!');
      await message.reply({
        embeds: [{
          title: 'Error',
          description: 'I do not have the `KICK_MEMBERS` permission!',
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

    if (!mem.kickable) {
      await message.reply({
        embeds: [{
          title: 'Error',
          description: `<:Error:949853701504372778> I can not kick <@${ mem.id }> **[ ${ mem.id } ]**\nThis user most likely has a higher role than me or is the owner.`,
          color: 'DARK_RED',
        }],
        ephemeral: true
      });
      return;
    }

    await message.guild.members.kick(mem.id);
    await message.reply({
      embeds: [{
        title: 'Success',
        description: `**${ mem.user.tag }** has been kicked.\nModerator: **${ message.author.tag }**`,
        color: 'GREEN',
      }],
      ephemeral: false
    });

  },
};
