const { MessageEmbed } = require('discord.js');

const entryCheck = require('../features/portcullis-captcha');
const anonymousSuggestion = require('../features/anonymous-suggestions');

let portcullis = true;

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    try {
      // checks if it's a dm for an anonymous suggestion
      if (message.channel.type === 'DM') {
        anonymousSuggestion(message);
      }

      // checks if it's a guild message for portcullis control
      if (message.channel.type === 'GUILD_TEXT') {
        if (message.member.id === process.env.OWNER_ID) {
          const invocation = message.content.split(' ');

          if (invocation[1] === 'portcullis' && invocation[0] === 'lift') {
            portcullis = !portcullis;
            const embed = new MessageEmbed()
              .setDescription('Portcullis lifted!')
              .setColor('#ff3864');
            message.channel.send({ embeds: [embed] });
          }
          if (invocation[1] === 'portcullis' && invocation[0] === 'lower') {
            portcullis = !portcullis;
            const embed = new MessageEmbed()
              .setDescription('Portcullis lowered!')
              .setColor('#ff3864');
            message.channel.send({ embeds: [embed] });
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    // executes the portcullis guard
    entryCheck(member, portcullis);
  }
};
