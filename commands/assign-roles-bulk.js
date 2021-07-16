const { MessageEmbed } = require('discord.js');
const getCSV = require('get-csv');

const { TAG_LOOKUP } = require('../utils/lookup');

module.exports = {
  slash: true,
  testOnly: true,
  name: 'assign-roles-bulk',
  description: 'Bulk assigns the given role to discord usernames.',
  minArgs: 2,
  expectedArgs: '<role> <csv file link>',
  callback: async ({ args, channel, client, interaction }) => {
    const isCleric = interaction.member.roles.includes(process.env.CLERIC_ID);

    if (!isCleric)
      return new MessageEmbed().setDescription(
        'Only Clerics can use this command.'
      );

    let [role, csv] = args;

    role = role.toLowerCase();

    if (!(role in TAG_LOOKUP)) {
      return new MessageEmbed().setDescription('Role not found.');
    }
    if (TAG_LOOKUP[role] !== 'Cohort') {
      return new MessageEmbed().setDescription(
        'Can only assign Cohort roles for now.'
      );
    }

    tagRole = TAG_LOOKUP[role];
    let discordNames = [];

    try {
      let rows = await getCSV(csv);
      rows.map((item) => discordNames.push(item.names));
    } catch (err) {
      return new MessageEmbed().setDescription("Couldn't parse the CSV file.");
    }

    try {
      let discordIds = [];
      let withoutDiscordIds = [];
      discordNames.map((name) =>
        client.users.cache.find((u) => u.tag === name)
          ? discordIds.push(client.users.cache.find((u) => u.tag === name).id)
          : withoutDiscordIds.push(name)
      );

      let usersAssignedToRoles = 0;
      discordIds.map((id) => {
        let member = channel.guild.members.cache.get(id);
        if (!member._roles.includes(process.env.COHORT_ID)) {
          member.roles.add(process.env.COHORT_ID);
          usersAssignedToRoles = usersAssignedToRoles + 1;
        }
      });

      return new MessageEmbed().setDescription(
        `Assigned **Cohort** role to ${usersAssignedToRoles} people. ${
          withoutDiscordIds.length
            ? `Couldn't find IDs for ${withoutDiscordIds.length} people. `
            : null
        }`
      );
    } catch (err) {
      console.log(err);
      return new MessageEmbed()
        .setDescription('Something went wrong!')
        .setColor('#ff3864');
    }
  }
};
