const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

const { consoleLogger, discordLogger } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gas-info')
    .setDescription('Returns gas price stats')
    .setDefaultPermission(true),
  async execute(interaction) {
    try {
      const res = await axios.get(
        'https://ethgasstation.info/api/ethgasAPI.json'
      );

      const embed = new MessageEmbed()
        .setColor('#ff3864')
        .setTimestamp()
        .addFields(
          {
            name: 'Fast',
            value: (res.data.fast / 10).toString()
          },
          {
            name: 'Standard',
            value: (res.data.average / 10).toString()
          },
          {
            name: 'Safelow',
            value: (res.data.safeLow / 10).toString()
          }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      consoleLogger.error(err);
      discordLogger('Error caught in gas info command.');
    }
  }
};
