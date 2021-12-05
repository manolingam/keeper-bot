const express = require('express');
const Discord = require('discord.js');
const dotenv = require('dotenv');

const { consoleLogger, discordLogger } = require('../utils/logger');
const { SECRETS } = require('../config');

dotenv.config();

const JOINUS_ROUTER = express.Router();

const trimString = (str, max) =>
  str.length > max ? `${str.slice(0, max - 3)}...` : str;

JOINUS_ROUTER.post('/application', async (req, res) => {
  const {
    name,
    discord,
    twitter,
    primary_skills,
    class_type,
    crypto_exp,
    availability,
    bio,
    goals,
    passion
  } = req.body;

  try {
    const embed = new Discord.MessageEmbed()
      .setColor('#ff3864')
      .setTitle('New Application')
      .setAuthor(name)
      .addFields(
        {
          name: 'Discord',
          value: discord || 'N/A'
        },
        {
          name: 'Twitter',
          value: twitter || 'N/A'
        },
        {
          name: 'Class Type',
          value: class_type
        },
        {
          name: 'Bio',
          value: trimString(bio, 1024)
        },
        {
          name: 'Goals',
          value: trimString(goals, 1024)
        },
        {
          name: 'Passion',
          value: trimString(passion, 1024)
        },
        {
          name: 'Experience in Crypto',
          value: crypto_exp.toString()
        },
        {
          name: 'Primary Skills',
          value: primary_skills
        },
        {
          name: 'Availability',
          value: availability
        }
      )
      .setTimestamp();

    req.CLIENT.guilds.cache
      .get(SECRETS.GUILD_ID)
      .channels.cache.get(SECRETS.COHORT_SUBMISSIONS_CHANNEL_ID)
      .send({ embeds: [embed] });
    res.json('SUCCESS');
  } catch (err) {
    consoleLogger.error(err);
    discordLogger('Error caught in posting client submission notification.');
    res.json('ERROR');
  }
});

module.exports = JOINUS_ROUTER;
