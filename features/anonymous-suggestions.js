const { MessageEmbed } = require('discord.js');

const titles = [
  'I heard a whisper.',
  'Someone whispered this.',
  "There's a gossip.",
  'Someone murmured.',
  'I hear people say this.'
];

const anonymousSuggestion = (message) => {
  const channel = message.client.channels.cache.get(
    process.env.WHISPERS_CHANNEL_ID
  );

  const invocation = message.content.split(' ');
  const whispered_message = message.content.split(' ');
  whispered_message.shift();

  if (invocation[0] !== 'whisper') return;

  const embed = new MessageEmbed()
    .setColor('#ff3864')
    .setTitle(titles[Math.floor(Math.random() * titles.length)])
    .setDescription(whispered_message.join(' '));

  channel.send({ embeds: [embed] });
};

module.exports = anonymousSuggestion;
