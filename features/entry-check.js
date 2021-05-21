const { welcomeMessages } = require('../utils/helpers');

const entryCheck = (client, portcullis) => {
  client.on('guildMemberAdd', (member) => {
    const tavern = member.guild.channels.cache.get(
      process.env.TAVERN_CHANNEL_ID
    );
    const commandCenter = member.guild.channels.cache.get(
      process.env.COMMAND_CENTER_ID
    );

    if (member.user.bot && portcullis) {
      commandCenter.send(`Kicked unauthorized bot, <@${member.id}>`);
      member.kick();
    } else if (member.user.bot && !portcullis) {
      commandCenter.send(
        `This bot is allowed to stay. Prove your worth, <@${member.id}>`
      );
    } else {
      tavern.send(welcomeMessages(member));
    }
  });
};

exports.entryCheck = entryCheck;
