const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Airtable = require('airtable');

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.API_KEY
});

const base = Airtable.base(process.env.TREASURY_BASE_ID);
const direct_transfers_table = base('Direct Transfers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register-tx')
    .setDescription('Adds info about a direct fund transfer to the guild')
    .addStringOption((option) =>
      option
        .setName('brief')
        .setDescription('A short brief about the tx')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('tx-link')
        .setDescription('The transaction link')
        .setRequired(true)
    )
    .setDefaultPermission(false),
  async execute(interaction) {
    try {
      const brief = interaction.options.getString('brief');
      const tx = interaction.options.getString('tx-link');

      const data = {
        Description: brief,
        'Etherscan Link': tx
      };

      await interaction.deferReply();

      await direct_transfers_table.create(data);

      const embed = new MessageEmbed()
        .setDescription('TX Data posted to Airtable.')
        .setColor('#ff3864');

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.log(err);
    }
  }
};
