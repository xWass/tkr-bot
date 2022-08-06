const { MessageEmbed } = require('discord.js');
const chalk = require('chalk');

module.exports = {
  name: 'help',
  usage: 'help',
  description: 'Displays help message',
  async execute(client, message, args) {
    console.log(`${chalk.greenBright('[EVENT ACKNOWLEDGED]')} messageCreate with command help`);

    const embed = new MessageEmbed();
    embed.setColor('GREEN');
    embed.setTitle('Bot Commands');
    embed.addFields(
      { name: 'Ban', value: 'Bans a mentioned user. \nUsage: \n```.ban <@member>```', inline: true },
      { name: 'Clear', value: 'Bulk deletes messages from a channel. \nUsage: \n```.clear <amount>```', inline: true },
      { name: 'Kick', value: 'Kicks a mentioned user. \nUsage: \n```.kick <@member>```', inline: true },
      { name: 'Mute', value: 'Mutes a mentioned user. \nUsage: \n```.mute <@member> <duration [1min, 1h, 1d]>```', inline: true },
      { name: 'Unmute', value: 'Unmutes a mentioned user. \nUsage: ```.unmute <@member>```', inline: true },
    );
    message.channel.send({ embeds: [embed] });
  },
};
