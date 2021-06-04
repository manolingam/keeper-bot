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

const handleReaction = async (reaction, user) => {
  if (user.id === process.env.BOT_ID) {
    return;
  }

  const { guild } = reaction.message;

  const tavern = guild.channels.cache.get(process.env.TAVERN_CHANNEL_ID);
  const commandCenter = guild.channels.cache.get(process.env.COMMAND_CENTER_ID);

  const emoji = reaction._emoji.name;

  try {
    let swammerId;

    let msg = await reaction.message.fetch();

    if (msg.author.id !== process.env.BOT_ID) return;

    if (msg.mentions.roles.first() !== undefined) {
      swammerId = msg.mentions.roles.first().id;
    } else if (msg.mentions.users.first() !== undefined) {
      swammerId = msg.mentions.users.first().id;
    }

    let swammerMember = await guild.members.fetch(swammerId);

    if (emoji === '👍') {
      tavern.send(welcomeMessages(swammerMember));
    } else if (emoji === '👎') {
      commandCenter.send(`${user.username} kicked <@${swammerMember.id}>`);
      swammerMember.kick();
    }

    if (emoji === '👍' || emoji === '👎') {
      reaction.message.delete();
    }
  } catch (err) {
    console.log(err);
    if (err.message === 'Unknown Member') {
      commandCenter.send(
        `This user in this message has left the server already - _${reaction.message.content}_`
      );
    }
    if (emoji === '👍' || emoji === '👎') {
      reaction.message.delete();
    }
  }
};

const entryCheck = (member) => {
  try {
    const tavern = member.guild.channels.cache.get(
      process.env.TAVERN_CHANNEL_ID
    );
    const swarmCouncil = member.guild.channels.cache.get(
      process.env.SWARM_COUNCIL_CHANNEL_ID
    );
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
    } else if (member.user.flags) {
      if (member.user.flags.bitfield === 0) {
        swarmCouncil
          .send(`Potential swammer, <@${member.id}>, react to decide!`)
          .then((message) => {
            message.react('👍');
            message.react('👎');
          });
      } else {
        tavern.send(welcomeMessages(member));
      }
    } else {
      tavern.send(welcomeMessages(member));
    }
  } catch (err) {
    console.log(err);
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

client.on('messageReactionAdd', (reaction, user) => {
  if (reaction.message.channel.id === process.env.SWARM_COUNCIL_CHANNEL_ID) {
    handleReaction(reaction, user);
  }
});

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
