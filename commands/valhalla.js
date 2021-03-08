module.exports = {
  name: 'valhalla',
  description: 'Sends a channel to Valhalla.',
  execute(message) {
    if (message.content.split(' ').length < 3)
      return message.channel.send(
        'Invalid number of args. Check `@keeper help valhalla`'
      );

    let channelId = message.content.split(' ')[2];
    channelId = channelId.substring(2, channelId.length - 1);

    try {
      let channel = message.guild.channels.cache.get(channelId);

      let category = message.guild.channels.cache.find(
        (c) => c.name == 'Valhalla 1/21' && c.type == 'category'
      );

      if (channel.parentID == process.env.VALHALLA_1_21_CHANNEL_ID) {
        message.channel.send('This is already in Valhalla!');
        return;
      }

      channel.setParent(category.id);

      message.channel.send('Sent to Valhalla 1/21.');
    } catch (err) {
      message.channel.send("Something's not good.");
    }
  }
};
