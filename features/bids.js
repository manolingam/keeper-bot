const Web3 = require('web3');
const { MessageEmbed } = require('discord.js');

const AuctionABI = require('../utils/auction-abi.json');

const newBidListener = (AuctionContract, currentBlockNumber, web3, client) => {
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
      console.log(`Connection Opened with subscription ID, ${subscriptionId}!`);
    })
    .on('data', function (event) {
      const bidAmount = web3.utils.fromWei(event.returnValues.amount, 'ether');
      const { submitter } = event.returnValues;
      const { id } = event.returnValues;

      console.log('event', {
        hash: event.transactionHash,
        'Bid Amount': bidAmount,
        Submitter: submitter,
        id
      });

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
        .get(process.env.GUILD_ID)
        .channels.cache.get(process.env.RAID_SWAP_ALERT_CHANNEL_ID)
        .send({ embeds: [embed] });
    })
    .on('error', function (error, receipt) {
      if (error) console.log('Error', error);
      if (receipt) console.log('Receipt', receipt);
    });
};

const bidIncreaseListener = (
  AuctionContract,
  currentBlockNumber,
  web3,
  client
) => {
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
      console.log(`Connection Opened with subscription ID, ${subscriptionId}!`);
    })
    .on('data', function (event) {
      const newAmount = web3.utils.fromWei(
        event.returnValues.newAmount,
        'ether'
      );
      const { id } = event.returnValues;

      console.log('event', {
        hash: event.transactionHash,
        'New Bid Amount': newAmount,
        id
      });

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
        .get(process.env.GUILD_ID)
        .channels.cache.get(process.env.RAID_SWAP_ALERT_CHANNEL_ID)
        .send({ embeds: [embed] });
    })
    .on('error', function (error, receipt) {
      if (error) console.log('Error', error);
      if (receipt) console.log('Receipt', receipt);
    });
};

const bidAccepted = (AuctionContract, currentBlockNumber, client) => {
  AuctionContract.events
    .BidAccepted(
      {
        fromBlock: currentBlockNumber
      },
      function (error, event) {
        if (error) console.log(error);
        if (event) console.log(event);
      }
    )
    .on('connected', function (subscriptionId) {
      console.log(`Connection Opened with subscription ID, ${subscriptionId}!`);
    })
    .on('data', function (event) {
      const { acceptedBy } = event.returnValues;
      const { id } = event.returnValues;

      console.log('event', {
        hash: event.transactionHash,
        'Accepted By': acceptedBy,
        id
      });

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
        .get(process.env.GUILD_ID)
        .channels.cache.get(process.env.RAID_SWAP_ALERT_CHANNEL_ID)
        .send({ embeds: [embed] });
    })
    .on('error', function (error, receipt) {
      if (error) console.log('Error', error);
      if (receipt) console.log('Receipt', receipt);
    });
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
    const embed = new MessageEmbed()
      .setColor('#ff3864')
      .setDescription('Something went wrong with the bids listener.');
    client.guilds.cache
      .get(process.env.GUILD_ID)
      .channels.cache.get(process.env.COMMAND_CENTER_ID)
      .send({ embeds: [embed] });
  }
};

module.exports = subscribeEvent;
