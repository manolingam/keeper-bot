const { MessageEmbed } = require('discord.js');

module.exports = {
  slash: true,
  testOnly: true,
  name: 'all-role-count',
  description: 'Returns the total number of users in each role.',
  callback: ({ channel }) => {
    try {
      let roles = [];
      let filterRoles = [
        '@everyone',
        'Available',
        'xDai-Faucet',
        'suggestion_bot',
        'sesh',
        'Friend Time',
        'Collab.Land',
        'Keeper',
        'HausBOT',
        'Server Booster',
        'INACTIVE',
        'verified',
        'Available',
        'BrightID Bot',
        'RaidGuild SourceCred',
        'xDai-Faucet',
        'Friend Time',
        'sesh'
      ];

      let ignoredRoles = '';
      filterRoles.map((role) => (ignoredRoles += `__*${role}*__ `));

      channel.guild.roles.cache.forEach((role) => {
        if (!filterRoles.includes(role.name)) {
          let count = channel.guild.roles.cache.get(role.id).members.size;
          roles.push(`**${role.name}** - ${count}`);
        }
      });

      let embed = new MessageEmbed()
        .setColor('#ff3864')
        .setDescription(
          `Counted in the important roles while ignoring these.\n\n${ignoredRoles}`
        )
        .addFields({ name: 'Counted roles', value: roles });

      return embed;
    } catch (err) {
      return new MessageEmbed()
        .setDescription('Something went wrong!')
        .setColor('#ff3864');
    }
  }
};
