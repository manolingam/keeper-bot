const { MessageEmbed } = require('discord.js');
const { SECRETS } = require('../config');
const { consoleLogger, discordLogger } = require('../utils/logger');

module.exports = {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember) {
    try {
      if (
        !oldMember.roles.cache.has(SECRETS.MEMBER_ROLE_ID) &&
        newMember.roles.cache.has(SECRETS.MEMBER_ROLE_ID)
      ) {
        const embed = new MessageEmbed()
          .setColor('#ff3864')
          .setDescription(
            `New member! Welcome to the Guild, <@${newMember.id}>!`
          );

        const channel = newMember.client.channels.cache.get(
          SECRETS.HQ_ANNOUNCEMENTS_CHANNEL_ID
        );

        channel.send({ embeds: [embed] });
      }
    } catch (err) {
      consoleLogger.error(err);
      discordLogger('Error caught in guild member update event.');
    }
  }
};
