const { ROLES } = require('../utils/constants');

module.exports = {
  name: 'available-summary',
  description:
    'Displays a summary of number of members available for raiding under each role.',
  execute(Discord, message) {
    let available_stats = [];

    ROLES.forEach((role) => {
      let count = 0;
      message.guild.members.cache.filter((member) => {
        if (member._roles.includes(process.env.AVAILABLE_ROLE_ID)) {
          if (member._roles.includes(role.id)) {
            count++;
          }
        }
      });
      available_stats.push({ name: role.name, value: count });
    });

    let embed = new Discord.MessageEmbed()
      .setColor('#ff3864')
      .setTitle('Overview of available raiders')
      .setTimestamp()
      .addFields(available_stats);

    message.channel.send(embed);
  }
};
