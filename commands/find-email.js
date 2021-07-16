const { MessageEmbed } = require('discord.js');
const { Client } = require('pg');

const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_SECRET,
  port: 5432
});

client.connect();

module.exports = {
  slash: true,
  testOnly: true,
  name: 'find-member-email',
  description: 'Finds the email address of a member with possible matches.',
  minArgs: 1,
  expectedArgs: '<member name>',
  callback: async ({ args, interaction }) => {
    try {
      const isMember = interaction.member.roles.includes(
        process.env.MEMBER_ROLE_ID
      );

      if (!isMember)
        return new MessageEmbed().setDescription(
          'Only members can use this command.'
        );

      let [name] = args;
      let results = [];

      let { rows } = await client.query(
        `select name, email from member_registry where LOWER(name) LIKE '%${name}%'`
      );

      rows.map((match) => {
        results.push({ name: match.name, value: match.email });
      });

      let embed = new MessageEmbed()
        .setDescription(
          results.length > 0
            ? 'Found the following matches.'
            : 'Could not find a match.'
        )
        .setColor('#ff3864')
        .addFields(results);
      return embed;
    } catch (err) {
      return new MessageEmbed()
        .setDescription('Something went wrong!')
        .setColor('#ff3864');
    }
  }
};
