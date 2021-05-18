// Package imports
const Discord = require('discord.js');

const WOKCommands = require('wokcommands');

const { welcomeMessages } = require('./utils/helpers');
const { roleClaim } = require('./features/role-claim');

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

  roleClaim(client);

  require('./server');
});

client.on('guildMemberAdd', (member) => {
  const tavern = member.guild.channels.cache.get(process.env.TAVERN_CHANNEL_ID);
  const commandCenter = member.guild.channels.cache.get(
    process.env.COMMAND_CENTER_ID
  );

  if (member.user.bot) {
    commandCenter.send(`Kicked unauthorized bot, <@${member.id}>`);
    member.kick();
  } else {
    tavern.send(welcomeMessages(member));
  }
});

client.login(process.env.TOKEN);
