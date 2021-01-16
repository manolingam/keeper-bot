module.exports = {
  name: 'valhalla',
  description: 'Sends a channel to Valhalla.',
  execute(message) {
    if (message.content.split(' ').length < 3)
      return message.channel
        .send('Invalid number of args. Check `@keeper help valhalla`')
        .then((message) => {
          setTimeout(() => {
            message.delete();
          }, 5000);
        });

    let channelId = message.content.split(' ')[2];
    channelId = channelId.substring(2, channelId.length - 1);

    try {
      let channel = message.guild.channels.cache.get(channelId);

      let category = message.guild.channels.cache.find(
        (c) => c.name == 'Valhalla 1/21' && c.type == 'category'
      );

      if (channel.parentID == process.env.VALHALLA_1_21_CHANNEL_ID) {
        message.channel.send('This is already in Valhalla!').then((message) => {
          setTimeout(() => {
            message.delete();
          }, 5000);
        });
        return;
      }

      channel.setParent(category.id);

      message.channel.send('Sent to Valhalla 1/21.').then((message) => {
        setTimeout(() => {
          message.delete();
        }, 5000);
      });
    } catch (err) {
      message.channel.send("Something's not good.").then((message) => {
        setTimeout(() => {
          message.delete();
        }, 5000);
      });
    }
  }
};
