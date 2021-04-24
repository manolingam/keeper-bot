// Package imports
const Discord = require('discord.js');

const WOKCommands = require('wokcommands');
const client = new Discord.Client({
  partials: ['MESSAGE', 'REACTION']
});

require('dotenv').config();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  new WOKCommands(client, {
    commandsDir: 'commands',
    testServers: [process.env.GUILD_ID],
    showWarns: false
  });

  require('./server');
});

client.login(process.env.TOKEN);
