const { initPrinter, createFields } = require('../utils/print-helpers');
const { TAG_LOOKUP, STR_LOOKUP } = require('../utils/lookup');

module.exports = {
  name: 'available-who',
  description:
    'List all active members within a specified role along with their availability.',
  execute(Discord, message, args) {
    if (args.length < 3) {
      return message.channel.send(
        `Please specify what role you are looking to search ex. *!keeper available-who wizard*`
      );
    }
    const printEmbeddedList = initPrinter(Discord, message);
    const available_grep = message.content.includes('available-grep');
    const available_full = message.content.includes('available-full');
    const userRoleList = args.slice(2).map((role) => role.toLowerCase());

    let convertedRoleNames;

    if (available_grep) {
      if (args.length > 3)
        return message.channel.send(
          'Substring search only supports one substring.'
        );

      convertedRoleNames = STR_LOOKUP.filter((str) =>
        str.includes(args[2].toLowerCase())
      ).map((r) => TAG_LOOKUP[r]);
    } else {
      if (!userRoleList.every((r) => TAG_LOOKUP[r])) {
        return message.channel.send(
          'One or more queries entered were not valid role queries.'
        );
      }
      convertedRoleNames = userRoleList.map((r) => TAG_LOOKUP[r]);
    }

    const discordRoles = message.guild.roles.cache.filter((r) =>
      convertedRoleNames.includes(r.name)
    );

    discordRoles.forEach((r) => {
      const checkRoleMsg = [
        {
          name: "Check 'Available' Role",
          value:
            "It's possible that guild members haven't added the 'Available' role yet."
        }
      ];

      if (r.members.size) {
        const available = r.members.filter(
          (member) =>
            member.roles.cache.has(process.env.AVAILABLE_ROLE_ID) &&
            !member.roles.cache.has(process.env.INACTIVE_ROLE_ID)
        );
        printEmbeddedList({
          message,
          title: `All ${r.name} Available:`,
          fields: available.size
            ? createFields(`Total: ${available.size}`, available.array())
            : checkRoleMsg
        });
        if (available_full) {
          const unavailable = r.members.filter(
            (member) => !member.roles.cache.has(process.env.AVAILABLE_ROLE_ID)
          );
          printEmbeddedList({
            message,
            title: `All ${r.name} Unavailable:`,
            fields: unavailable.size
              ? createFields(`Total: ${unavailable.size}`, unavailable.array())
              : checkRoleMsg
          });
        }
      } else {
        message.channel.send('There are no users who have this role.');
      }
    });
  }
};
