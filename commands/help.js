module.exports = {
    name: "help",
    description: "Returns the list of available commands for use.",
    execute(Discord, message, args) {
        const CREATE_RAID = `To create a raid channel, use **!keeper create-raid <project-name> <link-to-proposal> <party-member-1> <party-member-2>**. You don't need to mention yourself as a party member as it's default.`;
        const CREATE_RIP = `To create a rip channel, use **!keeper create-rip <project-name> <link-to-proposal> <party-member-1> <party-member-2>**. You don't need to mention yourself as a party member as it's default.`;
        const CREATE_CAMP = `To create a camp channel, use **!keeper create-camp <project-name> <link-to-proposal> <party-member-1> <party-member-2>**. You don't need to mention yourself as a party member as it's default.`;
        const VALHALLA = `To send a channel to Valhalla, use **!keeper valhalla <mention channel>**.`;
        const ROLE_STATS = `Returns the total number of members assigned to each role.`;
        const INACTIVE_STATS = `Returns total inactive members & their usernames.`;
        const TREASURY = `To record a direct transfer into the DAO bank, use **!keeper treasury "brief description" etherscan-link**.`;
        const GAS_INFO = `Returns the live gas price stats.`;
        const TIMEZONES = `Returns the current time in different timezones.`;

        if (args.length < 3)
            return message.channel.send("Missing command! Help with what?");

        switch (args[2]) {
            case "create-raid":
                return message.channel.send(
                    new Discord.MessageEmbed()

                        .setDescription(CREATE_RAID)
                        .setColor("#ff3864")
                );
            case "create-rip":
                return message.channel.send(
                    new Discord.MessageEmbed()

                        .setDescription(CREATE_RIP)
                        .setColor("#ff3864")
                );
            case "create-camp":
                return message.channel.send(
                    new Discord.MessageEmbed()

                        .setDescription(CREATE_CAMP)
                        .setColor("#ff3864")
                );
            case "valhalla":
                return message.channel.send(
                    new Discord.MessageEmbed()

                        .setDescription(VALHALLA)
                        .setColor("#ff3864")
                );
            case "role-stats":
                return message.channel.send(
                    new Discord.MessageEmbed()

                        .setDescription(ROLE_STATS)
                        .setColor("#ff3864")
                );
            case "inactive-stats":
                return message.channel.send(
                    new Discord.MessageEmbed()

                        .setDescription(INACTIVE_STATS)
                        .setColor("#ff3864")
                );
            case "treasury":
                return message.channel.send(
                    new Discord.MessageEmbed()

                        .setDescription(TREASURY)
                        .setColor("#ff3864")
                        .setFooter(
                            'Quotation marks "" are required enclosing the description.'
                        )
                );
            case "gas-info":
                return message.channel.send(
                    new Discord.MessageEmbed()

                        .setDescription(GAS_INFO)
                        .setColor("#ff3864")
                );
            case "timezones":
                return message.channel.send(
                    new Discord.MessageEmbed()

                        .setDescription(TIMEZONES)
                        .setColor("#ff3864")
                );
            default:
                return message.channel.send(
                    "Hmm.. I don't know what that command does. Check `!keeper help`"
                );
        }
    },
};
