module.exports = {
    name: "create-raid-rip-camp",
    description: "Starts a raid/rip/camp channel.",
    execute(Discord, message, args) {
        if (args.length < 4)
            return message.channel.send(
                `Some args are missing! Use **!keeper help ${args[1]}**.`
            );

        try {
            let type = "";
            if (args[1] === "create-raid") type = "raid";
            if (args[1] === "create-rip") type = "rip";
            if (args[1] === "create-camp") type = "camp";

            let projectName = args[2];
            let proposal = args[3];

            var pattern = new RegExp(
                "^" +
                    // protocol identifier (optional)
                    // short syntax // still required
                    "(?:(?:(?:https?|ftp):)?\\/\\/)" +
                    // user:pass BasicAuth (optional)
                    "(?:\\S+(?::\\S*)?@)?" +
                    "(?:" +
                    // IP address exclusion
                    // private & local networks
                    "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
                    "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
                    "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
                    // IP address dotted notation octets
                    // excludes loopback network 0.0.0.0
                    // excludes reserved space >= 224.0.0.0
                    // excludes network & broadcast addresses
                    // (first & last IP address of each class)
                    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                    "|" +
                    // host & domain names, may end with dot
                    // can be replaced by a shortest alternative
                    // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
                    "(?:" +
                    "(?:" +
                    "[a-z0-9\\u00a1-\\uffff]" +
                    "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
                    ")?" +
                    "[a-z0-9\\u00a1-\\uffff]\\." +
                    ")+" +
                    // TLD identifier name, may end with dot
                    "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
                    ")" +
                    // port number (optional)
                    "(?::\\d{2,5})?" +
                    // resource path (optional)
                    "(?:[/?#]\\S*)?" +
                    "$",
                "i"
            );

            if (!pattern.test(proposal))
                return message.channel.send(`Invalid proposal link!`);

            let validParty = true;
            let party = [message.author];
            let partyMessage = `${message.author} `;
            let channelPermissions = [
                {
                    id: process.env.BOT_ID,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                },
                {
                    id: message.guild.id,
                    deny: ["VIEW_CHANNEL"],
                },
                {
                    id: process.env.MEMBER_ROLE_ID,
                    allow: [
                        "VIEW_CHANNEL",
                        "READ_MESSAGE_HISTORY",
                        "SEND_MESSAGES",
                    ],
                },
                {
                    id: message.author,
                    allow: ["SEND_MESSAGES"],
                },
            ];

            if (args.length > 4) {
                for (let i = 4; i <= args.length - 1; i++) {
                    partyMessage = partyMessage + args[i] + " ";

                    let partyMember = args[i].slice(3, args[i].length - 1);
                    party.push(partyMember);

                    if (message.guild.member(partyMember)) {
                        channelPermissions.push({
                            id: partyMember,
                            allow: ["SEND_MESSAGES"],
                        });
                    } else {
                        validParty = false;
                        return message.channel.send(
                            `**${args[i]}** is not a valid member!`
                        );
                    }
                }
            }

            if (!validParty) return;

            let welcomeMessage = `Welcome to ${projectName}! ${partyMessage} Please refer to the following document to get started ${proposal}. Further more information will be posted ASAP.`;

            let embed = new Discord.MessageEmbed()
                .setColor("#ff3864")
                .setTitle(projectName)
                .setDescription(
                    `Welcome to the ${type} ${partyMessage}. Click on the title to refer details about the ${type}. Further more information will be posted ASAP.`
                )
                .setURL(proposal)
                .setTimestamp();

            if (type === "raid") {
                message.guild.channels
                    .create(`${type}-${projectName}`, {
                        reason: `${type}`,
                        type: "text",
                        parent: process.env.RAIDS_CATEGORY_ID,
                        topic: `A ${type} channel for ${projectName}.`,
                        permissionOverwrites: channelPermissions,
                    })
                    .then((channel) => channel.send(embed))
                    .catch(console.error);
            } else if (type === "rip") {
                message.guild.channels
                    .create(`${type}-${projectName}`, {
                        reason: `${type}`,
                        type: "text",
                        parent: process.env.RIPS_CATEGORY_ID,
                        topic: `A ${type} channel for ${projectName}.`,
                        permissionOverwrites: channelPermissions,
                    })
                    .then((channel) => channel.send(embed))
                    .catch(console.error);
            } else if (type === "camp") {
                message.guild.channels
                    .create(`${projectName}`, {
                        reason: `${type}`,
                        type: "text",
                        parent: process.env.CAMPS_CATEGORY_ID,
                        topic: `A ${type} channel for ${projectName}.`,
                        permissionOverwrites: channelPermissions,
                    })
                    .then((channel) => channel.send(embed))
                    .catch(console.error);
            }
        } catch (err) {
            const bot_center_channel = message.guild.channels.get(
                process.env.BOT_CENTER_CHANNEL_ID
            );
            bot_center_channel.send(
                `There was an error in the command ${args[1]}. \n**Error**: ${err}`
            );
        }
    },
};
