const { welcomeMessages } = require('../utils/helpers');

const entryCheck = (client) => {
  client.on('guildMemberAdd', (member) => {
    const tavern = member.guild.channels.cache.get(
      process.env.TAVERN_CHANNEL_ID
    );
    const commandCenter = member.guild.channels.cache.get(
      process.env.COMMAND_CENTER_ID
    );

    if (member.user.bot) {
      commandCenter.send(`Kicked unauthorized bot, <@${member.id}>`);
      member.kick();
    } else {
      tavern.send(welcomeMessages(member));
    }
  });
};

exports.entryCheck = entryCheck;
