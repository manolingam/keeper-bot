const Web3 = require('web3');
const { MessageEmbed } = require('discord.js');

const PairABI = require('../abi/token-abi.json');
const { consoleLogger, discordLogger } = require('../utils/logger');
const { SECRETS } = require('../config');

const subscribeEvent = (client) => {
  try {
    const provider = new Web3.providers.WebsocketProvider(
      'wss://rpc.xdaichain.com/wss',
      {
        clientConfig: {
          keepalive: true,
          keepaliveInterval: 60000
        },
        reconnect: {
          auto: true,
          delay: 5000,
          maxAttempts: 5,
          onTimeout: false
        }
      }
    );

    const web3 = new Web3(provider);

    const PairContract = new web3.eth.Contract(
      PairABI,
      '0x256f3A3b6897298cE11d34C0695c7Cf49c15D1b3'
    );

    PairContract.events
      .Swap(
        {
          fromBlock: 17921694
        },
        function (error, event) {
          if (error) consoleLogger.error(error);
          if (event) consoleLogger.info(event);
        }
      )
      .on('connected', function (subscriptionId) {
        consoleLogger.info(
          `Connection Opened with subscription ID, ${subscriptionId}!`
        );
      })
      .on('data', function (event) {
        const raid_in = web3.utils.fromWei(
          event.returnValues.amount0In,
          'ether'
        );
        const weth_out = web3.utils.fromWei(
          event.returnValues.amount1Out,
          'ether'
        );
        const weth_in = web3.utils.fromWei(
          event.returnValues.amount1In,
          'ether'
        );
        const raid_out = web3.utils.fromWei(
          event.returnValues.amount0Out,
          'ether'
        );

        if (parseInt(raid_in, 10) >= 500 || parseInt(raid_out, 10) >= 500) {
          const embed = new MessageEmbed()
            .setColor('#ff3864')
            .setTitle(
              raid_in === '0' ? 'Swap RAID for WETH' : 'Swap WETH for RAID'
            )
            .setAuthor(
              '$RAID',
              'https://res.cloudinary.com/saimano/image/upload/v1630599485/RaidGuild/icons/token/raid_200_oswlvz.png',
              'https://www.coingecko.com/en/coins/raid-token'
            )
            .setURL(
              `https://blockscout.com/xdai/mainnet/tx/${event.transactionHash}`
            )
            .addFields(
              {
                name: raid_in === '0' ? 'RAID Out' : 'RAID In',
                value:
                  raid_in === '0' ? raid_out.toString() : raid_in.toString()
              },
              {
                name: weth_in === '0' ? 'WETH Out' : 'WETH In',
                value:
                  weth_in === '0' ? weth_out.toString() : weth_in.toString()
              }
            )
            .setTimestamp();

          client.guilds.cache
            .get(SECRETS.GUILD_ID)
            .channels.cache.get(SECRETS.RAID_SWAP_ALERT_CHANNEL_ID)
            .send({ embeds: [embed] });
        }
      })
      .on('error', function (error, receipt) {
        if (error) consoleLogger.error(error);
        if (receipt) consoleLogger.info(receipt);
      });
  } catch (err) {
    discordLogger('Error caught in swap listener.');
  }
};

module.exports = subscribeEvent;
