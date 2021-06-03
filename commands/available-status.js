const { MessageEmbed } = require('discord.js');

module.exports = {
  slash: true,
  testOnly: true,
  name: 'my-availabilty-status',
  description: 'Allows a member to see their current availability.',
  callback: ({ interaction }) => {
    try {
      const isAvailable = interaction.member.roles.includes(
        process.env.AVAILABLE_ROLE_ID
      );

      const embed = new MessageEmbed()
        .setColor('#ff3864')
        .setTitle(
          isAvailable
            ? 'You are available for raids.'
            : 'You are not available for raids.'
        );

      return embed;
    } catch (err) {
      return new MessageEmbed()
        .setDescription('Something went wrong!')
        .setColor('#ff3864');
    }
  }
};
