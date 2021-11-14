const { SECRETS } = require('../config');
const { discordLogger, consoleLogger } = require('../utils/logger');

module.exports = {
  name: 'inviteCreate',
  async execute(invite) {
    try {
      const { inviter, channel } = invite;

      if (channel.type === 'GUILD_VOICE') {
        return;
      }

      if (inviter.id !== SECRETS.BOT_ID) {
        discordLogger(
          'Deleted unauthorized invite creation. Use `/create-invite` instead ' +
            `<@${inviter.id}>`
        );
        invite.delete();
      }
    } catch (err) {
      consoleLogger(err);
    }
  }
};
