const express = require("express");
const Raids = require("../models/raids_schema");

const HIREUS_ROUTER = express.Router();

HIREUS_ROUTER.post("/airtable", async (req, res) => {
    let {
        project_name,
        project_type,
        summary,
        specs,
        skills_needed,
        priorities,
        budget,
        name,
        email,
        handle,
        link,
        completion_date,
        about_guild,
        to_know,
        transaction_hash,
    } = req.body;

    await req.RAID_CENTRAL_V2_BASE("Raids").create(
        [
            {
                fields: {
                    Name: project_name,
                    "Project Type": project_type,
                    "Brief Summary": summary,
                    "Has Specs": specs,
                    "Skills Needed": skills_needed,
                    Priorities: priorities,
                    "Budget Allocated": budget,
                    "Your Name": name,
                    "Email Address": email,
                    "Telegram Handle": handle,
                    "Relevant Link": link,
                    "Desired date of completion": completion_date,
                    "How did you hear about the Guild?": about_guild,
                    "Anything else you'd like the Guild to know?": to_know,
                    "Consultation Hash": transaction_hash,
                },
            },
        ],
        function (err, records) {
            if (err) {
                console.error(err);
                return res.send("error");
            }
            records.forEach(function (record) {
                let id = record.getId();
                return res.send("success");
            });
        }
    );
});

HIREUS_ROUTER.post("/mongo", async (req, res) => {
    let {
        project_name,
        project_type,
        summary,
        specs,
        skills_needed,
        priorities,
        budget,
        name,
        email,
        handle,
        link,
        completion_date,
        about_guild,
        to_know,
        transaction_hash,
    } = req.body;

    try {
        let Discord = req.DISCORD;
        let embed = new Discord.MessageEmbed()
            .setColor("#ff3864")
            .setTitle(project_name)
            .setURL(`https://etherscan.io/tx/${transaction_hash}`)
            .setAuthor(name)
            .addFields(
                {
                    name: "Project Type",
                    value: project_type,
                },
                {
                    name: "Budget",
                    value: budget,
                },
                {
                    name: "Specs",
                    value: specs,
                },
                {
                    name: "Skills Needed",
                    value: skills_needed,
                },
                {
                    name: "Priorities",
                    value: priorities,
                },
                {
                    name: "Relevant Link",
                    value: link || "NaN",
                },
                {
                    name: "Contact",
                    value: `[${email}][${handle || "NaN"}]`,
                },
                {
                    name: "Expected Delivery Date",
                    value: completion_date || "NaN",
                }
            )
            .setTimestamp();

        req.CLIENT.guilds.cache
            .get(process.env.GUILD_ID)
            .channels.cache.get(process.env.CLIENT_SUBMISSION_CHANNEL_ID)
            .send(embed);
    } catch (err) {
        console.log("Error", err);
    }

    const raid = new Raids({
        project_name,
        project_type,
        summary,
        specs,
        skills_needed,
        priorities,
        budget,
        name,
        email,
        handle,
        link,
        completion_date,
        about_guild,
        to_know,
        transaction_hash,
    });

    raid.save()
        .then((data) => {
            console.log("Success - Mongo");
            res.send("Success - Mongo");
        })
        .catch((err) => {
            console.log(err);
            res.send("Error - Mongo");
        });
});

module.exports = HIREUS_ROUTER;
