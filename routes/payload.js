const express = require("express");

const PAYLOAD_ROUTER = express.Router();

PAYLOAD_ROUTER.post("/", (req, res) => {
    if (req.body.action === "labeled") {
        let url = req.body.issue.html_url;
        let title = req.body.issue.title;
        // let desc = req.body.issue.body || "No description provided.";
        // let state = req.body.issue.state;
        let label = req.body.label.name;

        if (label === "apprentice-issue") {
            let Discord = req.DISCORD;
            let embed = new Discord.MessageEmbed()
                .setColor("#ff3864")
                .setTitle(title)
                .setURL(url)
                .setAuthor("Issue Alert for Apprentice")
                .setTimestamp();

            req.CLIENT.guilds.cache
                .get(process.env.GUILD_ID)
                .channels.cache.get(process.env.LIBRARY_CHANNEL_ID)
                .send(embed);
        }

        if (label === "proposal") {
            let Discord = req.DISCORD;
            let embed = new Discord.MessageEmbed()
                .setColor("#ff3864")
                .setTitle(title)
                .setURL(url)
                .setAuthor("RIP Proposal Alert")
                .setTimestamp();

            req.CLIENT.guilds.cache
                .get(process.env.GUILD_ID)
                .channels.cache.get(process.env.RIP_DISCUSSIONS_CHANNEL_ID)
                .send(embed);
        }
    }

    res.send("Received");
});

module.exports = PAYLOAD_ROUTER;
