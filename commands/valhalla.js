const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { consoleLogger, discordLogger } = require('../utils/logger');
const { SECRETS } = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('to-valhalla')
    .setDescription('Sends a channel to Valhalla')
    .setDefaultPermission(false),
  async execute(interaction) {
    try {
      // const channel = interaction.options.getChannel('destination');

      // interaction.client.guilds.cache
      //   .get(process.env.GUILD_ID)
      //   .channels.cache.get(channel.id)
      //   .setParent(process.env.VALHALLA_6_21_CHANNEL_ID);

      // channel.setParent(process.env.VALHALLA_6_21_CHANNEL_ID);

      if (interaction.channel.parentId === SECRETS.VALHALLA_6_21_CHANNEL_ID) {
        const embed = new MessageEmbed()
          .setColor('#ff3864')
          .setDescription('This is already in Valhalla!');

        await interaction.reply({ embeds: [embed] });
      } else {
        interaction.channel.setParent(SECRETS.VALHALLA_6_21_CHANNEL_ID);

        const embed = new MessageEmbed()
          .setColor('#ff3864')
          .setDescription('Command executed');

        await interaction.reply({ embeds: [embed] });
      }
    } catch (err) {
      consoleLogger.error(err);
      discordLogger('Error caught in valhalla command.');
    }
  }
};
