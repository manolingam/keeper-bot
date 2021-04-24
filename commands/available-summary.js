const { MessageEmbed } = require('discord.js');
const { ROLES } = require('../utils/constants');

module.exports = {
  slash: true,
  testOnly: true,
  name: 'raiders-availabilty-summary',
  description:
    'Displays a summary of number of members available for raiding under each role.',
  callback: ({ channel }) => {
    try {
      let available_stats = [];

      ROLES.forEach((role) => {
        let count = 0;
        let available = 0;
        channel.guild.members.cache.filter((member) => {
          if (member._roles.includes(role.id)) {
            count++;
            if (member._roles.includes(process.env.AVAILABLE_ROLE_ID)) {
              available++;
            }
          }
        });
        available_stats.push({
          name: role.name,
          value: `${available} of ${count}`
        });
      });

      let embed = new MessageEmbed()
        .setColor('#ff3864')
        .setTimestamp()
        .addFields(available_stats);

      return embed;
    } catch (err) {
      return new MessageEmbed()
        .setDescription('Something went wrong!')
        .setColor('#ff3864');
    }
  }
};
