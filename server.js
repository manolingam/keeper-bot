const { Client, Intents } = require('discord.js');
const express = require('express');
const cors = require('cors');

const PAYLOAD_ROUTER = require('./routes/payload');
const HIREUS_V2_ROUTER = require('./routes/hireus-v2');
const ESCROW_ROUTER = require('./routes/escrow');

const subscribeEvent = require('./features/bids');

const createServer = () => {
  const client = new Client({
    partials: ['MESSAGE', 'REACTION', 'CHANNEL'],
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.DIRECT_MESSAGES
    ]
  });

  client.once('ready', () => {
    subscribeEvent(client);

    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use(
      '/payload',
      (req, res, next) => {
        req.CLIENT = client;
        next();
      },
      PAYLOAD_ROUTER
    );

    app.use(
      '/hireus-v2',
      (req, res, next) => {
        req.CLIENT = client;
        if (req.body.key === process.env.ROUTE_ACCESS_KEY) next();
      },
      HIREUS_V2_ROUTER
    );

    app.use(
      '/escrow',
      (req, res, next) => {
        req.CLIENT = client;
        next();
      },
      ESCROW_ROUTER
    );

    app.get('/', (req, res) => {
      res.send('Hi');
    });

    app.listen(process.env.PORT || 5000, () => console.log('Listening..'));
  });

  client.login(process.env.TOKEN);
};

module.exports = createServer;
