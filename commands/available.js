const { initPrinter } = require('../utils/print-helpers');

module.exports = {
  name: 'available',
  description: "Changes a member's availability",
  execute(Discord, message, args) {
    if (args.length < 3) {
      return message.channel
        .send(
          new Discord.MessageEmbed()
            .setColor('#ff3864')
            .setDescription(
              'Please specify whether or not you are available by adding **true** or **false** after ``@keeper available``'
            )
        )
        .then((message) => {
          setTimeout(() => {
            message.delete();
          }, 5000);
        });
    }
    //It checks for string 'true' and 'false' before parse.
    //JSON parse will crash if it recieves a value it doesn't recognize
    if (args[2].toLowerCase() !== 'true' && args[2].toLowerCase() !== 'false') {
      return message.channel
        .send(
          new Discord.MessageEmbed()
            .setColor('#ff3864')
            .setDescription(
              'This command only takes **true** or **false** as sub-commands after ``@keeper available``'
            )
        )
        .then((message) => {
          setTimeout(() => {
            message.delete();
          }, 5000);
        });
    }

    const isAvailable = message.member.roles.cache.has(
      process.env.AVAILABLE_ROLE_ID
    );
    const printEmbed = initPrinter(Discord, message);
    const boolArg = JSON.parse(args[2].toLowerCase());

    if (isAvailable && boolArg) {
      return message.channel
        .send(`You're already available for raids`)
        .then((message) => {
          setTimeout(() => {
            message.delete();
          }, 5000);
        });
    } else if (isAvailable && !boolArg) {
      message.member.roles
        .remove(process.env.AVAILABLE_ROLE_ID)
        .then(() => {
          printEmbed({
            title: `${message.author.username} is now unavailable for raids.`
          });
        })
        .catch((err) => {
          console.log(err);
          return message.channel
            .send(`Something went wrong.`)
            .then((message) => {
              setTimeout(() => {
                message.delete();
              }, 5000);
            });
        });
    } else if (!isAvailable && boolArg) {
      const isInactive = message.member.roles.cache.has(
        process.env.INACTIVE_ROLE_ID
      );
      if (isInactive) {
        message.channel
          .send(
            "Inactive users cannot be available for raids. Please remove 'inactive' role first."
          )
          .then((message) => {
            setTimeout(() => {
              message.delete();
            }, 5000);
          });
      } else {
        message.member.roles
          .add(process.env.AVAILABLE_ROLE_ID)
          .then(() => {
            printEmbed({
              title: `${message.author.username} is now available for raids.`
            });
          })
          .catch((err) => {
            console.log(err);
            return message.channel
              .send(`Something went wrong.`)
              .then((message) => {
                setTimeout(() => {
                  message.delete();
                }, 5000);
              });
          });
      }
    } else {
      return message.channel
        .send(`You were already unavailable.`)
        .then((message) => {
          setTimeout(() => {
            message.delete();
          }, 5000);
        });
    }
  }
};
