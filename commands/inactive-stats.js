const { MessageEmbed } = require('discord.js');

module.exports = {
  slash: true,
  testOnly: true,
  name: 'inactive-role-stats',
  description: 'Returns total users with the role inactive tagged.',
  callback: ({ channel }) => {
    try {
      let members = [];

      channel.guild.roles.cache
        .get(process.env.INACTIVE_ROLE_ID)
        .members.forEach((member) => {
          members.push(member.user.username);
        });

      let embed = new MessageEmbed()
        .setColor('#ff3864')
        .setTimestamp()
        .addFields(
          {
            name: 'Total Inactive',
            value: members.length
          },
          {
            name: 'Inactive Members',
            value: members
          }
        );

      return embed;
    } catch (err) {
      return new MessageEmbed()
        .setDescription('Something went wrong!')
        .setColor('#ff3864');
    }
  }
};
