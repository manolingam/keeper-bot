const express = require('express');
const Discord = require('discord.js');

const { consoleLogger, discordLogger } = require('../utils/logger');
const { SECRETS } = require('../config');

const PAYLOAD_ROUTER = express.Router();

PAYLOAD_ROUTER.post('/', (req, res) => {
  try {
    if (req.body.action === 'labeled') {
      const { html_url, title } = req.body.issue;
      const { name } = req.body.label;

      if (name === 'apprentice-issue') {
        const embed = new Discord.MessageEmbed()
          .setColor('#ff3864')
          .setTitle(title)
          .setURL(html_url)
          .setAuthor('Issue Alert for Apprentice')
          .setTimestamp();

        req.CLIENT.guilds.cache
          .get(SECRETS.GUILD_ID)
          .channels.cache.get(SECRETS.LIBRARY_CHANNEL_ID)
          .send({ embeds: [embed] });
      }

      if (name === 'proposal') {
        const embed = new Discord.MessageEmbed()
          .setColor('#ff3864')
          .setTitle(title)
          .setURL(html_url)
          .setAuthor('RIP Proposal Alert')
          .setTimestamp();

        req.CLIENT.guilds.cache
          .get(SECRETS.GUILD_ID)
          .channels.cache.get(SECRETS.RIP_DISCUSSIONS_CHANNEL_ID)
          .send({ embeds: [embed] });
      }
    }

    res.send('Received');
  } catch (err) {
    consoleLogger.error(err);
    discordLogger('Error caught in proposal alert.');
  }
});

module.exports = PAYLOAD_ROUTER;
