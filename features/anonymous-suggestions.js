const { MessageEmbed } = require('discord.js');
const { consoleLogger, discordLogger } = require('../utils/logger');
const { SECRETS } = require('../config');

const titles = [
  'I heard a whisper.',
  'Someone whispered this.',
  "There's a gossip.",
  'Someone murmured.',
  'I hear people say this.'
];

const anonymousSuggestion = (message) => {
  try {
    const invocation = message.content.split(' ');
    if (invocation[0] !== 'whisper') return;

    const channel = message.client.channels.cache.get(
      SECRETS.WHISPERS_CHANNEL_ID
    );

    const whispered_message = message.content.split(' ');
    whispered_message.shift();

    const embed = new MessageEmbed()
      .setColor('#ff3864')
      .setTitle(titles[Math.floor(Math.random() * titles.length)])
      .setDescription(whispered_message.join(' '));

    channel.send({ embeds: [embed] });
  } catch (err) {
    consoleLogger.error(err);
    discordLogger('Error caught in anonymous suggestions feature.');
  }
};

module.exports = anonymousSuggestion;
