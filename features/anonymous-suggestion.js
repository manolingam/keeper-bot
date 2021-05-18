const { MessageEmbed } = require('discord.js');

const anonymousSuggestion = (client) => {
  try {
    const channel = client.channels.cache.get(process.env.WHISPERS_CHANNEL_ID);

    const titles = [
      'I heard a whisper.',
      'Someone whispered this.',
      "There's a gossip.",
      'Someone murmured.',
      'I hear people say this.'
    ];

    client.on('message', (message) => {
      if (message.channel.type === 'dm') {
        let embed = new MessageEmbed()
          .setColor('#ff3864')
          .setTitle(titles[Math.floor(Math.random() * titles.length)])
          .setDescription(message);

        channel.send(embed);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

exports.anonymousSuggestion = anonymousSuggestion;
