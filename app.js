// Package imports
const Discord = require('discord.js');

const WOKCommands = require('wokcommands');

const { roleClaim } = require('./features/role-claim');
const { anonymousSuggestion } = require('./features/anonymous-suggestion');
const { entryCheck } = require('./features/portcullis-captcha');

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

  roleClaim(client);
  anonymousSuggestion(client);

  require('./server');
});

client.on('guildMemberAdd', (member) => {
  entryCheck(member, portcullis);
});

client.on('message', (message) => {
  if (!message.member) return;
  try {
    if (message.member.id === process.env.OWNER_ID) {
      let invocation = message.content.split(' ');
      if (invocation[1] === 'portcullis' && invocation[0] === 'lift') {
        portcullis = false;

        return message.channel.send(
          new Discord.MessageEmbed()
            .setDescription('Portcullis lifted!')
            .setColor('#ff3864')
        );
      } else if (invocation[1] === 'portcullis' && invocation[0] === 'lower') {
        portcullis = true;

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
