// Package imports
const Discord = require('discord.js');

const WOKCommands = require('wokcommands');

const { roleClaim } = require('./features/role-claim');
const { anonymousSuggestion } = require('./features/anonymous-suggestion');
const { welcomeMessages } = require('./utils/helpers.js');

const client = new Discord.Client({
  partials: ['MESSAGE', 'REACTION']
});

require('dotenv').config();

let portcullis = true;

const entryCheck = (member) => {
  const tavern = member.guild.channels.cache.get(process.env.TAVERN_CHANNEL_ID);
  const commandCenter = member.guild.channels.cache.get(
    process.env.COMMAND_CENTER_ID
  );

  if (member.user.bot && portcullis) {
    commandCenter.send(`Kicked unauthorized bot, <@${member.id}>`);
    member.kick();
  } else if (member.user.bot && !portcullis) {
    tavern.send(
      `This bot is allowed to stay. Prove your worth, <@${member.id}>`
    );
  } else {
    tavern.send(welcomeMessages(member));
  }
};

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
  entryCheck(member);
});

// controller

client.on('message', (message) => {
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
