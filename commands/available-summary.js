const { ROLES } = require('../utils/constants');

module.exports = {
  name: 'available-summary',
  description:
    'Displays a summary of number of members available for raiding under each role.',
  execute(Discord, message) {
    let available_stats = [];

    ROLES.forEach((role) => {
      let count = 0;
      let available = 0;
      message.guild.members.cache.filter((member) => {
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
  }
};
