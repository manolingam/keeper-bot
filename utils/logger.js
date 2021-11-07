const { createLogger, transports, format } = require('winston');

let discordClient = '';

const setDiscordClient = (_client) => {
  discordClient = _client;
};

const consoleLogger = createLogger({
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(format.timestamp(), format.simple())
    })
  ]
});

const discordLogger = (_msg) => {
  if (discordClient) {
    try {
      discordClient.guilds.cache
        .get(process.env.GUILD_ID)
        .channels.cache.get(process.env.COMMAND_CENTER_ID)
        .send({ content: _msg });
    } catch (err) {
      consoleLogger.error(err);
    }
  }
};

module.exports = {
  setDiscordClient,
  consoleLogger,
  discordLogger
};
