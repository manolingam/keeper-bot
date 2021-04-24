const { MessageEmbed } = require('discord.js');

module.exports = {
  slash: true,
  testOnly: true,
  name: 'all-role-count',
  description: 'Returns the total number of users in each role.',
  callback: ({ channel }) => {
    try {
      let roles = [];
      let filterRoles = ['@everyone'];

      channel.guild.roles.cache.forEach((role) => {
        if (!filterRoles.includes(role.name)) {
          let count = channel.guild.roles.cache.get(role.id).members.size;
          roles.push({ name: role.name, value: `${count}` });
        }
      });

      let embed = new MessageEmbed()
        .setColor('#ff3864')
        .setTimestamp()
        .addFields(roles);

      return embed;
    } catch (err) {
      return new MessageEmbed()
        .setDescription('Something went wrong!')
        .setColor('#ff3864');
    }
  }
};
