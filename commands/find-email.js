const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Client } = require('pg');
const dotenv = require('dotenv');

const { consoleLogger, discordLogger } = require('../utils/logger');
const { SECRETS } = require('../config');

dotenv.config();

const client = new Client({
  user: SECRETS.PG_USER,
  host: SECRETS.PG_HOST,
  database: SECRETS.PG_DB,
  password: SECRETS.PG_SECRET,
  port: 5432
});

client.connect();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('find-email')
    .setDescription('Looks for the email address of the member')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Member name to find the email for')
        .setRequired(true)
    )
    .setDefaultPermission(false),
  async execute(interaction) {
    try {
      const name = interaction.options.getString('name');
      const results = [];

      const { rows } = await client.query(
        `select name, email from member_registry where LOWER(name) LIKE '%${name}%'`
      );

      rows.forEach((match) => {
        results.push({ name: match.name, value: match.email });
      });

      const embed = new MessageEmbed()
        .setDescription(
          results.length > 0
            ? 'Found the following matches.'
            : 'Could not find a match.'
        )
        .setColor('#ff3864')
        .addFields(results);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      consoleLogger.error(err);
      discordLogger('Error caught in find email command.');
    }
  }
};
