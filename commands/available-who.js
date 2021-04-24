const { TAG_LOOKUP } = require('../utils/lookup');
const { MessageEmbed } = require('discord.js');

const createListString = (member) => {
  return `${member.user.username} is ${
    member.roles.cache.has(process.env.AVAILABLE_ROLE_ID)
      ? '**Available**'
      : '**Unavailable**'
  }`;
};

module.exports = {
  slash: true,
  testOnly: true,
  name: 'find-role-availabilty',
  description:
    'Lists users who marked themselves as available for the required role.',
  minArgs: 1,
  expectedArgs: '<role-name>',
  callback: ({ args, channel }) => {
    try {
      let [role] = args;

      role = role.toLowerCase();

      if (!(role in TAG_LOOKUP)) {
        return new MessageEmbed().setDescription('Role not found.');
      }

      tagRole = TAG_LOOKUP[role];

      const discordRoles = channel.guild.roles.cache.filter(
        (r) => tagRole === r.name
      );

      let available;

      discordRoles.forEach((r) => {
        if (!r.members.size) {
          return new MessageEmbed().setDescription(
            'There are no users who have this role.'
          );
        } else {
          available = r.members.filter(
            (member) =>
              member.roles.cache.has(process.env.AVAILABLE_ROLE_ID) &&
              !member.roles.cache.has(process.env.INACTIVE_ROLE_ID)
          );
        }
      });

      if (available.size) {
        let fields = available.array().map((m) => {
          return createListString(m);
        });

        const embed = new MessageEmbed()
          .setTitle(`All ${tagRole} Available:`)
          .setColor('#ff3864')
          .addFields({ name: `Total: ${available.size}`, value: fields })
          .setTimestamp();

        return embed;
      } else {
        const embed = new MessageEmbed()
          .setTitle(`Check 'Available' Role`)
          .setDescription(
            `It's possible that guild members haven't added the 'Available' role yet.`
          );

        return embed;
      }
    } catch (err) {
      return new MessageEmbed()
        .setDescription('Something went wrong!')
        .setColor('#ff3864');
    }
  }
};
