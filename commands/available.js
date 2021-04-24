const { MessageEmbed } = require('discord.js');

module.exports = {
  slash: true,
  testOnly: true,
  name: 'update-my-availability',
  description: 'Update your availability with either true or false',
  minArgs: 1,
  expectedArgs: '<boolean>',
  callback: ({ args, interaction }) => {
    console.log(interaction);
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
      interaction.member.roles
        .remove(process.env.AVAILABLE_ROLE_ID)
        .then(() => {
          return new MessageEmbed()
            .setColor('#ff3864')
            .setDescription(
              `${interaction.author.username} is now unavailable for raids.`
            );
        })
        .catch((err) => {
          console.log(err);
          return new MessageEmbed()
            .setColor('#ff3864')
            .setDescription(`Something went wrong.`);
        });
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
        interaction.member.roles
          .add(process.env.AVAILABLE_ROLE_ID)
          .then(() => {
            return new MessageEmbed()
              .setColor('#ff3864')
              .setDescription(
                `${message.author.username} is now available for raids.`
              );
          })
          .catch((err) => {
            console.log(err);
            return new MessageEmbed()
              .setColor('#ff3864')
              .setDescription(`Something went wrong.`);
          });
      }
    } else {
      return new MessageEmbed()
        .setColor('#ff3864')
        .setDescription(`You are already unavailable.`);
    }
  }
};
