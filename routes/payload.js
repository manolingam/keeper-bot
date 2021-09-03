const express = require('express');
const Discord = require('discord.js');

const PAYLOAD_ROUTER = express.Router();

PAYLOAD_ROUTER.post('/', (req, res) => {
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
        .get(process.env.GUILD_ID)
        .channels.cache.get(process.env.LIBRARY_CHANNEL_ID)
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
        .get(process.env.GUILD_ID)
        .channels.cache.get(process.env.RIP_DISCUSSIONS_CHANNEL_ID)
        .send({ embeds: [embed] });
    }
  }

  res.send('Received');
});

module.exports = PAYLOAD_ROUTER;
