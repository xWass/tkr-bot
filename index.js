require('dotenv').config();
const fs=require('fs');
const chalk=require('chalk');
const axios=require('axios');
const {
  Client, Collection, Intents, MessageEmbed,
}=require('discord.js');

const intents=new Intents();
intents.add(
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_MEMBERS,
);

const client=new Client({intents, partials: ['MESSAGE', 'REACTION'], allowedMentions: {parse: ['users']}});


client.LegacyCommands=new Collection();
client.SlashCommands=new Collection();
const commandFiles=fs.readdirSync('./slashcmds').filter((file) => file.endsWith('.js'));
const legFiles=fs.readdirSync('./legacycmds').filter((file) => file.endsWith('.js'));

const prefix='!';

process.on('unhandledRejection', (error) => {
  console.log(error);
});

const {REST}=require('@discordjs/rest');
const {Routes}=require('discord-api-types/v9');
const {clientId, guildId}=require('./config.json');

const commands=[];
for (const file of commandFiles) {
  const command=require(`./slashcmds/${ file }`);
  commands.push(command.data.toJSON());
}

// this posts commands to discord's api
const rest=new REST({version: '9'}).setToken(process.env.TOKEN);
(async () => {
  try {
    console.log(chalk.yellowBright('Started refreshing application [/] commands.'));

    await rest.put(
      Routes.applicationCommands(clientId),
      {body: commands},
    );
    console.log(chalk.greenBright('Successfully reloaded application [/] commands.'));
  } catch (error) {
    console.error(error);
  }
})();

// this sets the bot's presence
client.on('ready', async () => {
  client.user.setActivity('Slash Commands!', {type: 'LISTENING'});
});

// this logs commands
client.once('ready', async () => {
  for (const file of commandFiles) {
    console.log(`${ chalk.yellowBright('[SLASH COMMAND LOADED]') } ${ file }`);
  }
  for (const file of legFiles) {
    console.log(`${ chalk.yellowBright('[LEGACY COMMAND LOADED]') } ${ file }`);
  }
  console.log(chalk.greenBright('Ready!'));
});

// this sets commands into the SlashCommands collection
for (const file of commandFiles) {
  const command=require(`./slashcmds/${ file }`);
  client.SlashCommands.set(command.data.name, command);
}

// this listens for interactionCreate events (slash commands) and executes
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  const {id}=interaction.guild;
  const found=await client.db.collection('settings').findOne({guildid: id});
  if (!found) {
    await client.db.collection('settings').insertOne({guildid: id, enabled: true});
  }
  const command=client.SlashCommands.get(interaction.commandName);

  if (!command) return;
  console.log(`${ chalk.yellowBright('[EVENT FIRED]') } interactionCreate with command ${ interaction.commandName }`);
  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    interaction.reply({content: `${ error }`, ephemeral: true});
  }
});
for (const file of legFiles) {
  const cmd=require(`./legacycmds/${ file }`);
  client.LegacyCommands.set(cmd.name, cmd);
}

// this listens for messageCreate events (prefix based commands) and executes
client.on('messageCreate', async (message) => {
  // this specific piece is for anti scam
  await axios({
    method: 'post',
    url: 'https://anti-fish.bitflow.dev/check',
    data: {
      message: message.content,
    },
    headers: {'User-Agent': 'Diomedes (Moderation Bot)'},
  })
    .then(async (response) => {
      if (response.data.match) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) return;
        if (!message.guild.me.permissions.has('KICK_MEMBERS')) return;
        console.log(`${ chalk.redBright('[SCAM LINK] ') } ${ message.content }`);
        try {
          if (!message.member.kickable) return;
          await message.channel.send({
            embeds: [{
              title: 'Scam Message Deleted!',
              description: `${ message.author.tag } sent a scam link and it was deleted.`,
              color: 'DARK_RED',
              fields: [{
                name: 'Message',
                value: message.content,
              }],
            }],
          });
          await message.delete();
          await message.member
            .kick('Compromised account - sent scam link.');
        } catch (error) {
          return;
        }

      }
    })
    .catch(() => undefined);
  // after the anti scam check it runs the actual commands
  if (message.author.bot) return;

  if (!message.content.startsWith(prefix)) return;

  const split=message.content.split(' ');
  let search=split[1];
  if (message.content.startsWith(prefix)) search=split[0].slice(prefix.length);
  const command=client.LegacyCommands.get(search);
  if (command===undefined) return;

  let i=1;
  console.log(`${ chalk.yellowBright('[EVENT FIRED]') } messageCreate with content: ${ message.content }`);

  if (message.content.startsWith(prefix)) i++;
  while (i<=2) {
    i++;
    split.shift();
  }
  try {
    await command.execute(client, message, split);
  } catch (err) {
    message.reply(err.toString());
    console.log(`${ chalk.redBright('[ERROR]') } ${ err }`);
  }
});
client.on('messageDelete', async (message) => {
  if (message.author.bot) return;
  let channel=client.channels.cache.get(' ');
  try {
    channel.send({
      embeds: [{
        title: 'Message Deleted!',
        description: `${ message.author.tag } sent a message in ${ message.channel } and it was deleted.`,
        color: 'DARK_RED',
        fields: [{
          name: 'Message',
          value: message.content,
        }],
      }],
    })
  } catch {
    return;
  }
})
client.on('messageUpdate', async (oldMessage, newMessage) => {
/*
  if (message.author.bot) return;
  let channel=client.channels.cache.get(' ');
  try {
    channel.send({
      embeds: [{
        title: 'Message Edited!',
        description: `${ message.author.tag } edited a message in ${message.channel}.`,
        color: 'DARK_RED',
        fields: [
          {
          name: 'Old',
          value: oldMessage.content,
          },
          {
            name: 'New',
            value: newMessage.content,
          }
        ],
      }],
    });
  } catch {
    return;
  }
  */
})

  

client.login(process.env.TOKEN);
