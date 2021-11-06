const anonymousSuggestion = require('../features/anonymous-suggestions');
const { consoleLogger, discordLogger } = require('../utils/logger');

// let portcullis = true;

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    try {
      // checks if it's a dm for an anonymous suggestion
      if (message.channel.type === 'DM') {
        anonymousSuggestion(message);
      }

      // checks if it's a guild message for portcullis control
      // if (message.channel.type === 'GUILD_TEXT') {
      //   if (message.member.id === process.env.OWNER_ID) {
      //     const invocation = message.content.split(' ');

      //     if (invocation[1] === 'portcullis' && invocation[0] === 'lift') {
      //       portcullis = !portcullis;
      //       const embed = new MessageEmbed()
      //         .setDescription('Portcullis lifted!')
      //         .setColor('#ff3864');
      //       message.channel.send({ embeds: [embed] });
      //     }
      //     if (invocation[1] === 'portcullis' && invocation[0] === 'lower') {
      //       portcullis = !portcullis;
      //       const embed = new MessageEmbed()
      //         .setDescription('Portcullis lowered!')
      //         .setColor('#ff3864');
      //       message.channel.send({ embeds: [embed] });
      //     }
      // }
      // }
    } catch (err) {
      consoleLogger.error(err);
      discordLogger('Error caught in message event.');
    }
  }
};
