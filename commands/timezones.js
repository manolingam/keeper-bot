var moment = require("moment-timezone");

module.exports = {
    name: "timezones",
    description: "Returns the current time in different timezones.",
    execute(Discord, message) {
        let PST = moment().tz("America/Los_Angeles").format("LLL");
        let EST = moment().tz("America/New_York").format("LLL");
        let MST = moment().tz("America/Denver").format("LLL");
        let AEST = moment().tz("Australia/Sydney").format("LLL");
        let CEST = moment().tz("Europe/Berlin").format("LLL");
        let CST = moment().tz("America/Mexico_City").format("LLL");
        let IST = moment().tz("Asia/Kolkata").format("LLL");

        let embed = new Discord.MessageEmbed().setColor("#ff3864").addFields(
            {
                name: "America - Los Angeles (PST)",
                value: PST,
            },
            {
                name: "America - New York (EST)",
                value: EST,
            },
            {
                name: "America - Denver (MST)",
                value: MST,
            },
            {
                name: "Australia - Sydney (AEST)",
                value: AEST,
            },
            {
                name: "Europe - Berlin (CEST)",
                value: CEST,
            },
            {
                name: "America - Mexico (CST)",
                value: CST,
            },
            {
                name: "Asia - Kolkata (IST)",
                value: IST,
            }
        );
        message.channel.send(embed);
    },
};
