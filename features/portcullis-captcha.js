const { MessageEmbed } = require('discord.js');
const randomWords = require('random-words');
const welcomeMessages = require('../utils/helpers');

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
        console.log('Time out');
      });

    console.log(collected);

    const reply = collected.first() ? collected.first().content : null;
    return reply;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const entryCheck = async (member) => {
  try {
    const tavern = member.guild.channels.cache.get(
      process.env.TAVERN_CHANNEL_ID
    );
    const commandCenter = member.guild.channels.cache.get(
      process.env.COMMAND_CENTER_ID
    );

    if (member.user.bot) {
      commandCenter.send({
        content: `Kicked unauthorized bot, <@${member.id}>`
      });
      member.kick();
    } else {
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
        tavern.send({ content: welcomeMessages(member) });
      } else {
        reply = await captchaResponse(
          member,
          new MessageEmbed().setDescription(
            'Captcha is invalid. Please try again one last time with a proper captcha. Timer is reset to 1 minute.'
          )
        );

        // chance 2
        if (reply === captcha[0]) {
          tavern.send({ content: welcomeMessages(member) });
        } else {
          member.send(
            new MessageEmbed().setDescription(
              'Sorry, no valid response received within the time. Try joining the server again if you missed it.'
            )
          );
          commandCenter.send({
            content: `Kicked <@${member.id}> due to portcullis verification fail.`
          });
          member.kick();
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = entryCheck;
