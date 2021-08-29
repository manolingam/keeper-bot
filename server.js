const express = require('express');
const cors = require('cors');

const PAYLOAD_ROUTER = require('./routes/payload');
const HIREUS_V2_ROUTER = require('./routes/hireus-v2');
const ESCROW_ROUTER = require('./routes/escrow');

const createServer = (client) => {
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

  client.login(process.env.TOKEN);

  app.listen(process.env.PORT || 5000, () => console.log('Listening..'));
};

module.exports = createServer;
