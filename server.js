const Discord = require('discord.js');
const client = new Discord.Client();
const Airtable = require('airtable');
const express = require('express');
const cors = require('cors');

const PAYLOAD_ROUTER = require('./routes/payload');
const DAOSHOP_ROUTER = require('./routes/daoshop');
const HIREUS_V2_ROUTER = require('./routes/hireus-v2');
const TWITTER_ROUTER = require('./routes/twitter');
const ESCROW_ROUTER = require('./routes/escrow');

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.API_KEY
});

let daoshop_base = Airtable.base(process.env.DAOSHOP_BASE_ID);
let raid_central_v2_base = Airtable.base(process.env.RAID_CENTRAL_V2_BASE_ID);

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  '/payload',
  (req, res, next) => {
    req.DISCORD = Discord;
    req.CLIENT = client;
    next();
  },
  PAYLOAD_ROUTER
);
app.use(
  '/daoshop',
  (req, res, next) => {
    req.DISCORD = Discord;
    req.CLIENT = client;
    req.DAOSHOP_BASE = daoshop_base;
    if (req.body.key === process.env.ROUTE_ACCESS_KEY) {
      next();
    } else {
      return res.send('Unauthorized access!');
    }
  },
  DAOSHOP_ROUTER
);
app.use(
  '/hireus-v2',
  (req, res, next) => {
    req.DISCORD = Discord;
    req.CLIENT = client;
    req.RAID_CENTRAL_V2_BASE = raid_central_v2_base;
    if (req.body.key === process.env.ROUTE_ACCESS_KEY) {
      next();
    } else {
      return res.send('Unauthorized access!');
    }
  },
  HIREUS_V2_ROUTER
);
app.use(
  '/escrow',
  (req, res, next) => {
    req.RAID_CENTRAL_V2_BASE = raid_central_v2_base;
    next();
  },
  ESCROW_ROUTER
);
app.use(
  '/twitter',
  (req, res, next) => {
    req.CLIENT = client;
    next();
  },
  TWITTER_ROUTER
);
app.get('/', (req, res) => {
  res.send('Hi');
});

client.login(process.env.TOKEN);

app.listen(process.env.PORT || 5000, () => console.log('Listening..'));
