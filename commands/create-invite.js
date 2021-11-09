const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { consoleLogger, discordLogger } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-invite')
    .setDescription('Creates an invite with expiry.')
    .setDefaultPermission(true),
  async execute(interaction) {
    try {
      const invite = await interaction.channel.createInvite({
        maxAge: 300,
        unique: true,
        maxUses: 5
      });

      const embed = new MessageEmbed()
        .setColor('#ff3864')
        .setDescription(`https://discord.gg/${invite.code}`);

      await interaction.reply({ embeds: [embed], ephemeral: true });
      discordLogger(`<@${interaction.member.id}> created an invite.`);
    } catch (err) {
      consoleLogger.error(err);
      discordLogger('Error caught in create invite command.');
    }
  }
};
