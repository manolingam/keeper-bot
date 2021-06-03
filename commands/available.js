const { MessageEmbed } = require('discord.js');

module.exports = {
  slash: true,
  testOnly: true,
  name: 'update-my-availability',
  description: 'Update your availability with either true or false',
  minArgs: 1,
  expectedArgs: '<boolean>',
  callback: ({ args, interaction, channel }) => {
    try {
      let [status] = args;

      if (status.toLowerCase() !== 'true' && status.toLowerCase() !== 'false') {
        return new MessageEmbed()
          .setColor('#ff3864')
          .setDescription('This command only takes **true** or **false**');
      }

      const isAvailable = interaction.member.roles.includes(
        process.env.AVAILABLE_ROLE_ID
      );

      const boolArg = JSON.parse(status.toLowerCase());

      if (isAvailable && boolArg) {
        return new MessageEmbed()
          .setColor('#ff3864')
          .setDescription(`You're already available for raids`);
      } else if (isAvailable && !boolArg) {
        const member = channel.guild.members.cache.get(
          interaction.member.user.id
        );
        member.roles.remove(process.env.AVAILABLE_ROLE_ID);
        return new MessageEmbed()
          .setColor('#ff3864')
          .setDescription(
            `${interaction.member.user.username} is now unavailable for raids.`
          );
      } else if (!isAvailable && boolArg) {
        const isInactive = interaction.member.roles.includes(
          process.env.INACTIVE_ROLE_ID
        );

        if (isInactive) {
          return new MessageEmbed()
            .setColor('#ff3864')
            .setDescription(
              `Inactive users cannot be made available for raids. Please remove 'inactive' role first.`
            );
        } else {
          const member = channel.guild.members.cache.get(
            interaction.member.user.id
          );
          member.roles.add(process.env.AVAILABLE_ROLE_ID);
          return new MessageEmbed()
            .setColor('#ff3864')
            .setDescription(
              `${interaction.member.user.username} is now available for raids.`
            );
        }
      } else {
        return new MessageEmbed()
          .setColor('#ff3864')
          .setDescription(`You are already unavailable.`);
      }
    } catch (err) {
      let embed = new MessageEmbed()
        .setColor('#ff3864')
        .setDescription('Invalid Argument.');
      return embed;
    }
  }
};
