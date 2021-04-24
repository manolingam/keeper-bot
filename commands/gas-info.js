const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
  slash: true,
  testOnly: true,
  name: 'gas-info',
  description: 'Returns gas price stats.',
  callback: ({}) => {
    axios
      .get('https://ethgasstation.info/api/ethgasAPI.json')
      .then((res) => {
        let embed = new MessageEmbed.setColor('#ff3864')
          .setTimestamp()
          .addFields(
            {
              name: 'Fast',
              value: res.data.fast / 10
            },
            {
              name: 'Standard',
              value: res.data.average / 10
            },
            {
              name: 'Safelow',
              value: res.data.safeLow / 10
            }
          );

        return embed;
      })
      .catch((err) => {
        return new MessageEmbed.setDescription(
          'Something went wrong. Try again later!'
        ).setColor('#ff3864');
      });
  }
};
