const { MessageEmbed } = require('discord.js');
const randomWords = require('random-words');
const welcomeMessages = require('../utils/helpers');

const { consoleLogger, discordLogger } = require('../utils/logger');
const { SECRETS } = require('../config');

const captchaResponse = async (member, message) => {
  try {
    const msg = await member.send({ embeds: [message] });
    const filter = (collected) => collected.author.id === member.id;
    const collected = await msg.channel
      .awaitMessages({
        filter,
        max: 1,
        time: 60000
      })
      .catch(() => {
        consoleLogger.warn('Captcha timed out');
      });

    const reply = collected.first() ? collected.first().content : null;
    return reply;
  } catch (err) {
    consoleLogger.error(err);
    discordLogger('Error caught in captcha response.');
    return null;
  }
};

const entryCheck = async (member) => {
  try {
    const tavern = member.guild.channels.cache.get(SECRETS.TAVERN_CHANNEL_ID);

    if (member.user.bot && SECRETS.ALLOW_BOTS === 'false') {
      discordLogger(`Kicked unauthorized bot, <@${member.id}>`);
      member.kick();
      return;
    }

    if (member.user.bot && SECRETS.ALLOW_BOTS === 'true') {
      discordLogger(`Bot <@${member.id}> has entered the tavern`);
      return;
    }

    const captcha = randomWords({ exactly: 1, wordsPerString: 5 });

    let reply = await captchaResponse(
      member,
      new MessageEmbed()
        .setTitle('Portcullis verification')
        .setDescription(
          `Welcome, ${member}! I am Sentry from RaidGuild. Please enter the below words exactly within a minute to get yourself verified. Else you will be kicked out for security reasons. You got 2 tries.\n\n**${captcha}**`
        )
    );

    // chance 1
    if (reply === captcha[0]) {
      member.roles.add(SECRETS.MOLOCH_SOLDIER_ROLE_ID);
      tavern.send({ content: welcomeMessages(member) });
      return;
    }

    reply = await captchaResponse(
      member,
      new MessageEmbed().setDescription(
        'Captcha is invalid. Please try again one last time with a proper captcha. Timer is reset to 1 minute.'
      )
    );

    // chance 2
    if (reply === captcha[0]) {
      member.roles.add(SECRETS.MOLOCH_SOLDIER_ROLE_ID);
      tavern.send({ content: welcomeMessages(member) });
      return;
    }

    member.send(
      new MessageEmbed().setDescription(
        'Sorry, no valid response received within the time. Try joining the server again if you missed it.'
      )
    );

    discordLogger(`Kicked unverified user, <@${member.id}>`);
    member.kick();
  } catch (err) {
    consoleLogger.error(err);
    discordLogger('Error caught in entry check.');
  }
};

module.exports = entryCheck;
