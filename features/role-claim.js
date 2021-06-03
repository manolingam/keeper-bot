const { MessageEmbed } = require('discord.js');

const handleReaction = (reaction, user, add, emojis) => {
  if (user.id === process.env.BOT_ID) {
    return;
  }

  const emoji = reaction._emoji.name;

  const { guild } = reaction.message;

  const roleName = emojis[emoji];
  if (!roleName) {
    return;
  }

  const role = guild.roles.cache.find((role) => role.name === roleName);
  const member = guild.members.cache.find((member) => member.id === user.id);

  if (add) {
    member.roles.add(role);
  } else {
    member.roles.remove(role);
  }
};

const addReaction = (message, reactions) => {
  message.react(reactions[0]);
  reactions.shift();
  if (reactions.length > 0) {
    setTimeout(() => {
      addReaction(message, reactions);
    }, 750);
  }
};

const roleClaim = (client) => {
  const startHereChannelID = process.env.START_HERE_CHANNEL_ID;

  const getEmoji = (emojiName) =>
    client.emojis.cache.find((emoji) => emoji.name === emojiName);

  const swordEmoji = getEmoji('raid');

  const emojis = {
    cleric: 'Cleric (Account Manager)',
    scribe: 'Scribe (Content Creator)',
    monk: 'Monk (PM)',
    healer: 'Healer (Internal Ops)',
    ranger: 'Ranger (UX Design)',
    tavern: 'Tavern Keeper (Community)',
    alchemist: 'Alchemist (DAO Consultant)',
    hunter: 'Hunter (BizDev)',
    rogue: 'Rogue (Business Affairs/Legal)',
    warrior: 'Warrior (FrontEnd Dev)',
    paladin: 'Paladin (Backend Dev)',
    archer: 'Archer (Visual Design)',
    necro: 'Necromancer (DevOps)',
    dwarf: 'AngryDwarf (Treasury)',
    druid: 'Druid (Data Science/Analyst)',
    wizard: 'Wizard (Smart Contracts)'
  };

  const reactions = [];

  let emojiText = '';

  for (const key in emojis) {
    const emoji = getEmoji(key);
    reactions.push(emoji);
    const role = emojis[key];
    emojiText += `${emoji} - **${role}**\n\n`;
  }

  const channel = client.channels.cache.get(startHereChannelID);
  let embed = new MessageEmbed()
    .setColor('#ff3864')
    .setTitle('Role Selection')
    .setDescription(
      `Raise your swords and take up a role champ!\n\n__*Pick the roles which you are good at. Choose as many roles as you like - React with the related emoji.\n\nMade a mistake? You can remove roles at any time, the same way you selected them. Just tap the emoji again and the role will be removed*__.\n\n${swordEmoji} ${swordEmoji} ${swordEmoji} ${swordEmoji} ${swordEmoji}\n\n${emojiText}`
    );

  channel.messages.fetch().then((messages) => {
    if (messages.size === 1) {
      channel.send(embed).then((message) => {
        addReaction(message, reactions);
      });
    }
  });

  client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.channel.id === startHereChannelID) {
      handleReaction(reaction, user, true, emojis);
    }
  });

  client.on('messageReactionRemove', (reaction, user) => {
    if (reaction.message.channel.id === startHereChannelID) {
      handleReaction(reaction, user, false, emojis);
    }
  });
};

exports.roleClaim = roleClaim;
