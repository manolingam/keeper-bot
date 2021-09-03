const express = require('express');
const Discord = require('discord.js');

const { initAirtableClient } = require('../config');

require('dotenv').config();

const raids_v2_table = initAirtableClient();

const ESCROW_ROUTER = express.Router();

ESCROW_ROUTER.post('/validate-raid', async (req, res) => {
  try {
    if (req.body.ID === '') res.json('NOT_FOUND');
    const result = await raids_v2_table.find(req.body.ID);

    console.log('Retrieved', result.id);
    res.json(result.fields);
  } catch (err) {
    if (err.error === 'NOT_FOUND') {
      res.json(err.error);
    }
  }
});

ESCROW_ROUTER.post('/update-raid', async (req, res) => {
  try {
    const { ID, Hash, Index } = req.body;
    const data = {
      'Locker Hash': Hash,
      'Escrow Index': Index
    };

    await raids_v2_table.update(ID, data);
    res.json('SUCCESS');
  } catch (err) {
    console.error(err);
    res.json('ERROR');
  }
});

ESCROW_ROUTER.post('/update-invoice', async (req, res) => {
  try {
    const { ID, Hash, Index } = req.body;
    const data = {
      'Locker Hash': Hash,
      'Invoice ID': Index
    };

    await raids_v2_table.update(ID, data);
    res.json('SUCCESS');
  } catch (err) {
    console.error(err);
    res.json('ERROR');
  }
});

ESCROW_ROUTER.post('/notify-spoils', async (req, res) => {
  const { token, raidPartyShare, guildShare, txLink } = req.body;

  try {
    const embed = new Discord.MessageEmbed()
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
      .send({ embeds: [embed] });

    res.json('SUCCESS');
  } catch (err) {
    console.log(err);
    res.json('ERROR');
  }
});

module.exports = ESCROW_ROUTER;
