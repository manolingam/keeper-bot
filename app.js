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

client.on('guildMemberAdd', (member) => {
  const randomGreetings = [
    'Glad you are here, ',
    'Everyone welcome ',
    'Welcome, ',
    'Good to see you, '
  ];

  const tavern = member.guild.channels.cache.get(process.env.TAVERN_CHANNEL_ID);
  const commandCenter = member.guild.channels.cache.get(
    process.env.COMMAND_CENTER_ID
  );

  if (member.user.bot) {
    commandCenter.send(`Kicked unauthorized bot, <@${member.id}>`);
    member.kick();
  } else {
    var greeting =
      randomGreetings[Math.floor(Math.random() * randomGreetings.length)];
    tavern.send(`${greeting}<@${member.id}>`);
  }
});

client.login(process.env.TOKEN);
