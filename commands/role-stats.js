const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { consoleLogger, discordLogger } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('primary-roles-count')
    .setDescription('Returns the total number of users in each primary role.')
    .setDefaultPermission(true),
  async execute(interaction) {
    try {
      const roles = [];
      const filterRoles = [
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
      filterRoles.forEach((role) => {
        if (role !== '@everyone') ignoredRoles += `__*${role}*__\t\t`;
      });

      interaction.guild.roles.cache.forEach((role) => {
        if (!filterRoles.includes(role.name)) {
          const count = interaction.guild.roles.cache.get(role.id).members.size;
          roles.push(`${role.name} - ${count}\n`);
        }
      });

      const embed = new MessageEmbed()
        .setColor('#ff3864')
        .setDescription(
          `Counted in the primary roles while ignoring these.\n\n${ignoredRoles}`
        )
        .addFields({ name: 'Primary roles', value: roles.toString() });

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      consoleLogger.error(err);
      discordLogger('Error caught in role stats command.');
    }
  }
};
