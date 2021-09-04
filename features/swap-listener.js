const Web3 = require('web3');
const { MessageEmbed } = require('discord.js');

const PairABI = require('../utils/token-abi.json');

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
          fromBlock: 17916698
        },
        function (error, event) {
          if (error) console.log(error);
          if (event) console.log(event);
        }
      )
      .on('connected', function (subscriptionId) {
        console.log(
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
          console.log('event', {
            hash: event.transactionHash,
            sender: event.returnValues.sender,
            'Raid In': raid_in,
            'WETH Out': weth_out,
            'WETH In': weth_in,
            'RAID Out': raid_out
          });

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
            .get(process.env.GUILD_ID)
            .channels.cache.get(process.env.RAID_SWAP_ALERT_CHANNEL_ID)
            .send({ embeds: [embed] });
        }
      })
      .on('error', function (error, receipt) {
        if (error) console.log('Error', error);
        if (receipt) console.log('Receipt', receipt);
      });
  } catch (err) {
    const embed = new MessageEmbed()
      .setColor('#ff3864')
      .setDescription('Something went wrong with the swap listener.');
    client.guilds.cache
      .get(process.env.GUILD_ID)
      .channels.cache.get(process.env.COMMAND_CENTER_ID)
      .send({ embeds: [embed] });
  }
};

module.exports = subscribeEvent;
