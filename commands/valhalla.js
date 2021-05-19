const { MessageEmbed } = require('discord.js');

module.exports = {
  slash: true,
  testOnly: true,
  name: 'valhalla-this',
  description: 'Sends a channel to Valhalla.',
  minArgs: 1,
  expectedArgs: '<channel>',
  callback: ({ channel, args, interaction }) => {
    let [channelId] = args;
    channelId = channelId.substring(2, channelId.length - 1);

    try {
      const isMember = interaction.member.roles.includes(
        process.env.MEMBER_ROLE_ID
      );

      if (!isMember)
        return new MessageEmbed().setDescription(
          'Only members can use this command.'
        );

      let _channel = channel.guild.channels.cache.get(channelId);
      let category = channel.guild.channels.cache.find(
        (c) => c.name == 'Valhalla 1/21' && c.type == 'category'
      );

      if (_channel.parentID == process.env.VALHALLA_1_21_CHANNEL_ID) {
        let embed = new MessageEmbed()
          .setColor('#ff3864')
          .setDescription('This is already in Valhalla!');

        return embed;
      }

      _channel.setParent(category.id);

      let embed = new MessageEmbed()
        .setColor('#ff3864')
        .setDescription('Sent to Valhalla 1/21.');

      return embed;
    } catch (err) {
      console.log(err);
      let embed = new MessageEmbed()
        .setColor('#ff3864')
        .setDescription('Invalid Argument.');
      return embed;
    }
  }
};
