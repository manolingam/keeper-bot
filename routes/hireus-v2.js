const express = require('express');
const Discord = require('discord.js');
const dotenv = require('dotenv');

const { initPgClient, initAirtableClient } = require('../config');

dotenv.config();

const client = initPgClient();
client.connect();

const raids_v2_table = initAirtableClient();

const HIREUS_V2_ROUTER = express.Router();

HIREUS_V2_ROUTER.post('/awaiting-raids', async (req, res) => {
  try {
    const { rows } = await client.query(
      `SELECT * FROM raids_v2 WHERE raid_status IS NULL`
    );
    return res.json(rows);
  } catch (err) {
    return res.json(err);
  }
});

HIREUS_V2_ROUTER.post('/consultation', async (req, res) => {
  let { selectedDay } = req.body;

  if (selectedDay === '') {
    selectedDay = new Date().toLocaleDateString();
  } else {
    selectedDay = new Date(selectedDay).toLocaleDateString();
  }

  const data = {
    Name: req.body.name,
    Email: req.body.email,
    Bio: req.body.bio,
    'Telegram Handle': req.body.telegramHandle,
    'Discord Handle': req.body.discordHandle,
    'Twitter Handle': req.body.twitterHandle,
    'Preferred Contact Method': req.body.contactType,
    'Project Type': req.body.projectType,
    'Project Specs': req.body.projectSpecs,
    'Specs Link': req.body.specsLink,
    'Project Name': req.body.projectName,
    'Project Description': req.body.projectDescription,
    'Services Required': req.body.servicesRequired,
    'Expected Deadline': selectedDay,
    'Budget Range': req.body.budgetRange,
    'Additional Information': req.body.specificInfo,
    Priorities: req.body.priority,
    'Consultation Hash': req.body.transaction_hash
  };

  try {
    const response = await raids_v2_table.create(data);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.json('ERROR');
  }

  try {
    const embed = new Discord.MessageEmbed()
      .setColor('#ff3864')
      .setTitle(
        req.body.transaction_hash !== 'not paid'
          ? 'Paid Submission'
          : 'Unpaid Submission'
      )
      .setURL(
        req.body.transaction_hash !== 'not paid'
          ? `https://etherscan.io/tx/${req.body.transaction_hash}`
          : null
      )
      .setAuthor(req.body.name)
      .addFields(
        {
          name: 'Project Name',
          value: req.body.projectName
        },
        {
          name: 'Project Type',
          value: req.body.projectType
        },
        {
          name: 'Specs Link',
          value: req.body.specsLink || 'None Provided'
        },

        {
          name: 'Budget Range',
          value: req.body.budgetRange
        },
        {
          name: 'Services Required',
          value: req.body.servicesRequired
        },
        {
          name: 'Priority',
          value: req.body.priority
        },
        {
          name: 'Email',
          value: req.body.email
        },
        {
          name: 'Discord',
          value: req.body.discordHandle || 'Not Provided'
        },
        {
          name: 'Twitter Handle',
          value: req.body.twitterHandle || 'Not Provided'
        },
        {
          name: 'Telegram Handle',
          value: req.body.telegramHandle || 'Not Provided'
        },
        {
          name: 'Preffered Contact Channel',
          value: req.body.contactType
        }
      )
      .setTimestamp();

    req.CLIENT.guilds.cache
      .get(process.env.GUILD_ID)
      .channels.cache.get(process.env.CLIENT_SUBMISSION_CHANNEL_ID)
      .send({ embeds: [embed] });
  } catch (err) {
    console.log('Error', err);

    const embed = new Discord.MessageEmbed()
      .setColor('#ff3864')
      .setTitle(
        'Something went wrong with the recent client submission notification. Check airtable for data.'
      );

    req.CLIENT.guilds.cache
      .get(process.env.GUILD_ID)
      .channels.cache.get(process.env.BOT_CENTER_CHANNEL_ID)
      .send({ embeds: [embed] });
  }
});

HIREUS_V2_ROUTER.post('/feedback', async (req, res) => {
  const { raidID, feedbackOne, feedbackTwo, rating } = req.body;

  const data = {
    'How did you hear about us?': feedbackOne,
    'What can be better?': feedbackTwo,
    Rating: Number(rating)
  };

  try {
    await raids_v2_table.update(raidID, data);

    res.json('SUCCESS');
  } catch (err) {
    console.error(err);
    res.json('ERROR');
  }

  try {
    const embed = new Discord.MessageEmbed()
      .setColor('#ff3864')
      .setTitle('New hireus feedback received')
      .addFields(
        {
          name: 'Rating given.',
          value: rating ? Number(rating) : 'Not provided.'
        },
        {
          name: 'How the user heard about us?',
          value: feedbackOne || 'Not provided.'
        },
        {
          name: 'What can be better?',
          value: feedbackTwo || 'Not provided.'
        }
      );

    req.CLIENT.guilds.cache
      .get(process.env.GUILD_ID)
      .channels.cache.get(process.env.WHISPERS_CHANNEL_ID)
      .send({ embeds: [embed] });
  } catch (err) {
    console.log(err);
  }
});

module.exports = HIREUS_V2_ROUTER;
