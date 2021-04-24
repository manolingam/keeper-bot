const Airtable = require('airtable');
const { MessageEmbed } = require('discord.js');

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.API_KEY
});

let treasury_base = Airtable.base(process.env.TREASURY_BASE_ID);

module.exports = {
  slash: true,
  testOnly: true,
  name: 'register-tx',
  description: 'Adds info about a direct fund transfer to the guild.',
  minArgs: 2,
  expectedArgs: '<brief> <tx-link>',
  callback: ({ args }) => {
    try {
      const [brief, tx] = args;

      treasury_base('Direct Transfers').create(
        [
          {
            fields: {
              Description: brief,
              'Etherscan Link': tx
            }
          }
        ],
        function (err, records) {
          if (err) {
            console.error(err);
            return;
          }
          records.forEach(function (record) {
            console.log(record.getId());
          });
        }
      );

      return new MessageEmbed()
        .setDescription('TX Data posted to Airtable.')
        .setColor('#ff3864');
    } catch (err) {
      return new MessageEmbed()
        .setDescription('Something went wrong!')
        .setColor('#ff3864');
    }
  }
};
