const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('raid-price')
    .setDescription('Returns RAID token price stats')
    .setDefaultPermission(true),
  async execute(interaction) {
    try {
      const res = await axios.get(
        'https://api.coingecko.com/api/v3/coins/raid-token?developer_data=false'
      );

      const embed = new MessageEmbed()
        .setColor('#ff3864')
        .setTitle('$RAID Stats')
        .setURL(
          'https://info.honeyswap.org/#/pair/0x256f3a3b6897298ce11d34c0695c7cf49c15d1b3'
        )
        .setThumbnail(
          'https://res.cloudinary.com/saimano/image/upload/v1630599485/RaidGuild/icons/token/raid_200_oswlvz.png'
        )
        .addFields(
          {
            name: 'Current Price',
            value: res.data.market_data.current_price.usd.toString()
          },
          {
            name: '24hr High',
            value: res.data.market_data.high_24h.usd.toString()
          },
          {
            name: '24hr Low',
            value: res.data.market_data.low_24h.usd.toString()
          },
          {
            name: '24hr Price Change (USD)',
            value: res.data.market_data.price_change_24h.toString()
          },
          {
            name: '24hr Price Change (Percent)',
            value: res.data.market_data.price_change_percentage_24h.toString()
          },
          {
            name: 'Total Supply',
            value: res.data.market_data.total_supply.toString()
          },
          {
            name: 'Contract Address (xDai)',
            value: res.data.contract_address.toString()
          },
          { name: 'Coingecko Rank', value: res.data.coingecko_rank.toString() }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.log(err);
    }
  }
};
