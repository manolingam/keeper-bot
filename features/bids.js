const Web3 = require('web3');
const { MessageEmbed } = require('discord.js');

const AuctionABI = require('../abi/auction-abi.json');
const { consoleLogger, discordLogger } = require('../utils/logger');
const { SECRETS } = require('../config');

const newBidListener = (AuctionContract, currentBlockNumber, web3, client) => {
  try {
    AuctionContract.events
      .NewBid(
        {
          fromBlock: currentBlockNumber
        },
        function (error, event) {
          if (error) console.log(error);
          if (event) console.log(event);
        }
      )
      .on('connected', function (subscriptionId) {
        consoleLogger.info(
          `Connection Opened with subscription ID, ${subscriptionId}!`
        );
      })
      .on('data', function (event) {
        const bidAmount = web3.utils.fromWei(
          event.returnValues.amount,
          'ether'
        );
        const { submitter } = event.returnValues;
        const { id } = event.returnValues;

        const embed = new MessageEmbed()
          .setColor('#ff3864')
          .setTitle('New Bid')
          .setURL(
            `https://blockscout.com/xdai/mainnet/tx/${event.transactionHash}`
          )
          .addFields(
            {
              name: 'ID',
              value: id.toString()
            },
            {
              name: 'Bid Amount',
              value: `${bidAmount.toString()} RAID`
            },
            {
              name: 'Submitter',
              value: submitter.toString()
            }
          )
          .setTimestamp();

        client.guilds.cache
          .get(SECRETS.GUILD_ID)
          .channels.cache.get(SECRETS.RAID_SWAP_ALERT_CHANNEL_ID)
          .send({ embeds: [embed] });
      })
      .on('error', function (error, receipt) {
        if (error) consoleLogger.error(error);
        if (receipt) consoleLogger.info(receipt);
      });
  } catch (err) {
    consoleLogger.error(err);
    discordLogger('Error caught in new bid listener.');
  }
};

const bidIncreaseListener = (
  AuctionContract,
  currentBlockNumber,
  web3,
  client
) => {
  try {
    AuctionContract.events
      .BidIncreased(
        {
          fromBlock: currentBlockNumber
        },
        function (error, event) {
          if (error) console.log(error);
          if (event) console.log(event);
        }
      )
      .on('connected', function (subscriptionId) {
        consoleLogger.info(
          `Connection Opened with subscription ID, ${subscriptionId}!`
        );
      })
      .on('data', function (event) {
        const newAmount = web3.utils.fromWei(
          event.returnValues.newAmount,
          'ether'
        );
        const { id } = event.returnValues;

        const embed = new MessageEmbed()
          .setColor('#ff3864')
          .setTitle('Bid Increase')
          .setURL(
            `https://blockscout.com/xdai/mainnet/tx/${event.transactionHash}`
          )
          .addFields(
            {
              name: 'ID',
              value: id.toString()
            },
            {
              name: 'New Bid Amount',
              value: `${newAmount.toString()} RAID`
            }
          )
          .setTimestamp();

        client.guilds.cache
          .get(SECRETS.GUILD_ID)
          .channels.cache.get(SECRETS.RAID_SWAP_ALERT_CHANNEL_ID)
          .send({ embeds: [embed] });
      })
      .on('error', function (error, receipt) {
        if (error) consoleLogger.error(error);
        if (receipt) consoleLogger.info(receipt);
      });
  } catch (err) {
    consoleLogger.error(err);
    discordLogger('Error caught in bid increase listener.');
  }
};

const bidAccepted = (AuctionContract, currentBlockNumber, client) => {
  try {
    AuctionContract.events
      .BidAccepted(
        {
          fromBlock: currentBlockNumber
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
        const { acceptedBy } = event.returnValues;
        const { id } = event.returnValues;

        const embed = new MessageEmbed()
          .setColor('#ff3864')
          .setTitle('Bid Accepted')
          .setURL(
            `https://blockscout.com/xdai/mainnet/tx/${event.transactionHash}`
          )
          .addFields(
            {
              name: 'ID',
              value: id.toString()
            },
            {
              name: 'Accepted By',
              value: acceptedBy.toString()
            }
          )
          .setTimestamp();

        client.guilds.cache
          .get(SECRETS.GUILD_ID)
          .channels.cache.get(SECRETS.RAID_SWAP_ALERT_CHANNEL_ID)
          .send({ embeds: [embed] });
      })
      .on('error', function (error, receipt) {
        if (error) consoleLogger.error(error);
        if (receipt) consoleLogger.info(receipt);
      });
  } catch (err) {
    consoleLogger.error(err);
    discordLogger('Error caught in bid accepted listener.');
  }
};

const subscribeEvent = async (client) => {
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

    const currentBlockNumber = await web3.eth.getBlockNumber();
    const AuctionContract = new web3.eth.Contract(
      AuctionABI,
      '0xD880b00877726c2B76173aCEc061b29C27D5d791'
    );

    newBidListener(AuctionContract, currentBlockNumber, web3, client);
    bidIncreaseListener(AuctionContract, currentBlockNumber, web3, client);
    bidAccepted(AuctionContract, currentBlockNumber, client);
  } catch (err) {
    consoleLogger.error(err);
    discordLogger('Error caught in bids listener.');
  }
};

module.exports = subscribeEvent;
