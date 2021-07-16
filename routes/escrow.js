const express = require('express');

const ESCROW_ROUTER = express.Router();

ESCROW_ROUTER.post('/validate', async (req, res) => {
  if (req.body.ID == '') return res.json('NOT_FOUND');
  await req
    .RAID_CENTRAL_V2_BASE('Raids')
    .find(req.body.ID, function (err, record) {
      if (err) {
        if (err.error === 'NOT_FOUND') {
          res.json(err.error);
        }
        return;
      }
      console.log('Retrieved', record.id);
      res.json(record.fields);
    });
});

ESCROW_ROUTER.post('/update', async (req, res) => {
  let { ID, Hash, Index } = req.body;

  await req.RAID_CENTRAL_V2_BASE('Raids').update(
    [
      {
        id: ID,
        fields: {
          'Locker Hash': Hash,
          'Escrow Index': Index
        }
      }
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        res.json('ERROR');
        return;
      }
      records.forEach(function (record) {
        res.json('SUCCESS');
      });
    }
  );
});

// Routes for the new Raids V2 base

ESCROW_ROUTER.post('/validate-raid', async (req, res) => {
  if (req.body.ID == '') return res.json('NOT_FOUND');
  await req
    .RAID_CENTRAL_V2_BASE('Raids v2')
    .find(req.body.ID, function (err, record) {
      if (err) {
        if (err.error === 'NOT_FOUND') {
          res.json(err.error);
        }
        return;
      }
      console.log('Retrieved', record.id);
      res.json(record.fields);
    });
});

ESCROW_ROUTER.post('/update-raid', async (req, res) => {
  let { ID, Hash, Index } = req.body;

  await req.RAID_CENTRAL_V2_BASE('Raids v2').update(
    [
      {
        id: ID,
        fields: {
          'Locker Hash': Hash,
          'Escrow Index': Index
        }
      }
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        res.json('ERROR');
        return;
      }
      records.forEach(function (record) {
        res.json('SUCCESS');
      });
    }
  );
});

ESCROW_ROUTER.post('/update-invoice', async (req, res) => {
  let { ID, Hash, Index } = req.body;

  await req.RAID_CENTRAL_V2_BASE('Raids v2').update(
    [
      {
        id: ID,
        fields: {
          'Locker Hash': Hash,
          'Invoice ID': Index
        }
      }
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        res.json('ERROR');
        return;
      }
      records.forEach(function (record) {
        res.json('SUCCESS');
      });
    }
  );
});

ESCROW_ROUTER.post('/notify-spoils', async (req, res) => {
  let { token, raidPartyShare, guildShare, txLink } = req.body;

  try {
    let Discord = req.DISCORD;
    let embed = new Discord.MessageEmbed()
      .setColor('#ff3864')
      .setTitle('Spoils Alert')
      .setURL(txLink)
      .addFields(
        {
          name: 'Guild Spoils',
          value: `${guildShare} ${token}`
        },
        {
          name: 'Raid Party Share',
          value: `${raidPartyShare} ${token}`
        }
      );

    req.CLIENT.guilds.cache
      .get(process.env.GUILD_ID)
      .channels.cache.get(process.env.SMART_ESCROW_CHANNEL_ID)
      .send(embed);

    res.json('SUCCESS');
  } catch (err) {
    console.log(err);
    res.json('ERROR');
  }
});

module.exports = ESCROW_ROUTER;
