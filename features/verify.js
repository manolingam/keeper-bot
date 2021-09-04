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

  const role = guild.roles.cache.find((_role) => _role.name === roleName);
  const member = guild.members.cache.find((_member) => _member.id === user.id);

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

const molochRoleClaim = (client) => {
  const getEmoji = (emojiName) =>
    client.emojis.cache.find((emoji) => emoji.name === emojiName);

  const emojis = {
    molochsoldier: 'Moloch Soldier'
  };

  const reactions = [];

  Object.keys(emojis).forEach((key) => {
    const emoji = getEmoji(key);
    reactions.push(emoji);
  });

  const channel = client.channels.cache.get(process.env.UNLOCK_CHANNEL_ID);
  const embed = new MessageEmbed()
    .setColor('#ff3864')
    .setTitle('Verify Myself')
    .setDescription(
      'React with the moloch soldier role below to unlock messaging in the server.'
    );

  channel.messages.fetch().then((messages) => {
    if (messages.size === 0) {
      channel.send({ embeds: [embed] }).then((message) => {
        addReaction(message, reactions);
      });
    }
  });

  client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.channel.id === process.env.UNLOCK_CHANNEL_ID) {
      const member = user.client.guilds.cache
        .get(process.env.GUILD_ID)
        .members.cache.get(user.id);

      const isMember = member.roles.cache.has(process.env.MEMBER_ROLE_ID);
      const isCohort = member.roles.cache.has(process.env.COHORT_ROLE_ID);
      const isSoldier = member.roles.cache.has(
        process.env.MOLOCH_SOLDIER_ROLE_ID
      );

      if (
        !isMember &&
        !isCohort &&
        !isSoldier &&
        member.joinedTimestamp + 120000 > Date.now()
      ) {
        handleReaction(reaction, user, true, emojis);
      } else {
        reaction.users.remove(user.id);
      }
    }
  });

  client.on('messageReactionRemove', (reaction, user) => {
    if (reaction.message.channel.id === process.env.UNLOCK_CHANNEL_ID) {
      handleReaction(reaction, user, false, emojis);
    }
  });
};

module.exports = molochRoleClaim;
