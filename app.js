// Package imports
const Discord = require('discord.js');

const WOKCommands = require('wokcommands');

const { entryCheck } = require('./features/entry-check');
const { roleClaim } = require('./features/role-claim');
const { anonymousSuggestion } = require('./features/anonymous-suggestion');

const client = new Discord.Client({
  partials: ['MESSAGE', 'REACTION']
});

require('dotenv').config();

let portcullis = true;

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  new WOKCommands(client, {
    commandsDir: 'commands',
    testServers: [process.env.GUILD_ID],
    showWarns: false
  });

  entryCheck(client, portcullis);
  roleClaim(client);
  anonymousSuggestion(client);

  require('./server');
});

// controller

client.on('message', (message) => {
  try {
    if (message.member.id === process.env.OWNER_ID) {
      let invocation = message.content.split(' ');
      if (invocation[1] === 'portcullis' && invocation[0] === 'lift') {
        portcullis = false;

        client.removeListener('guildMemberAdd', (member) =>
          console.log(member)
        );

        entryCheck(client, portcullis);
        return message.channel.send(
          new Discord.MessageEmbed()
            .setDescription('Portcullis lifted!')
            .setColor('#ff3864')
        );
      } else if (invocation[1] === 'portcullis' && invocation[0] === 'lower') {
        portcullis = true;

        client.removeListener('guildMemberAdd', (member) =>
          console.log(member)
        );

        entryCheck(client, portcullis);
        return message.channel.send(
          new Discord.MessageEmbed()
            .setDescription('Portcullis lowered!')
            .setColor('#ff3864')
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
});

client.login(process.env.TOKEN);
