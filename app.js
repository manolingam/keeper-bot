// Package imports
const Discord = require("discord.js");
const client = new Discord.Client();
const Airtable = require("airtable");
const axios = require("axios");
const fs = require("fs");

require("dotenv").config();

// Constant imports
const constants = require("./utils/constants");
const { PREFIX, HELP_MESSAGE } = constants;

// Airtable Configuration
Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: process.env.API_KEY,
});

let treasury_base = Airtable.base(process.env.TREASURY_BASE_ID);

// Command files configuration
client.commands = new Discord.Collection();
const commandFiles = fs
    .readdirSync("./commands/")
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Bot on ready
client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    require("./server");
});

// Bot on message
client.on("message", (message) => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
    if (
        !message.member.roles.member._roles.includes(process.env.MEMBER_ROLE_ID)
    )
        return message.channel.send("Access restricted to members.");

    let args = message.content.slice(PREFIX.length).split(/ +/);
    let command = args[1];

    if (
        args.length == 2 &&
        message.content.startsWith(PREFIX) &&
        args[1] === "help"
    ) {
        let embed = new Discord.MessageEmbed()

            .setDescription(
                "Welcome Guilder. I do a lot of automation for the guild and below are some of my visible executable commands that you can use."
            )
            .setColor("#ff3864")

            .addFields(HELP_MESSAGE)
            .setFooter(
                "For more information about a command, use !keeper help <command>"
            );
        return message.channel.send(embed);
    }

    switch (command) {
        case "help":
            return client.commands.get("help").execute(Discord, message, args);
        case "create-raid":
            return client.commands
                .get("create-raid-rip-camp")
                .execute(Discord, message, args);
        case "create-rip":
            return client.commands
                .get("create-raid-rip-camp")
                .execute(Discord, message, args);
        case "create-camp":
            return client.commands
                .get("create-raid-rip-camp")
                .execute(Discord, message, args);
        case "valhalla":
            return client.commands.get("valhalla").execute(message);
        case "role-stats":
            return client.commands.get("role-stats").execute(Discord, message);
        case "inactive-stats":
            return client.commands
                .get("inactive-stats")
                .execute(Discord, message);
        case "treasury":
            return client.commands
                .get("treasury")
                .execute(message, treasury_base);
        case "gas-info":
            return client.commands
                .get("gas-info")
                .execute(Discord, message, axios);
        case "timezones":
            return client.commands.get("timezones").execute(Discord, message);
        default:
            return message.channel.send(
                "Invalid command! Check **!keeper help**."
            );
    }
});

// client.on("guildMemberAdd", (member) => {
//     const welcomeId = process.env.WELCOME_CHANNEL_ID;
//     const tavernId = process.env.TAVERN_CHANNEL_ID;
//     const agoraId = process.env.AGORA_CHANNEL_ID;

//     try {
//         const message = `RaidGuild welcomes you, <@${
//             member.id
//         }! Introduce yourself in ${member.guild.channels.cache
//             .get(tavernId)
//             .toString()} & check out ${member.guild.channels.cache
//             .get(agoraId)
//             .toString()} for updates & information.`;

//         const welcome_channel = member.guild.channels.cache.get(welcomeId);
//         welcome_channel.send(message);
//     } catch (err) {
//         console.log(err);
//         const bot_center_channel = member.guild.channels.get(
//             process.env.BOT_CENTER_CHANNEL_ID
//         );
//         bot_center_channel.send(
//             `There was an error in ${member.guild.channels.cache
//                 .get(welcomeId)
//                 .toString()}. \n**Error**: ${err}`
//         );
//     }
// });

client.login(process.env.TOKEN);
