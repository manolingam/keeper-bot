const express = require("express");
const Clients = require("../models/clients_schema");

const DAOSHOP_ROUTER = express.Router();

DAOSHOP_ROUTER.post("/airtable", async (req, res) => {
    let {
        project_name,
        summary,
        skills_needed,
        specs,
        name,
        email,
        handle,
        about_guild,
        to_know,
        slot_1,
        slot_2,
        slot_3,
        transaction_hash,
    } = req.body;

    await req.DAOSHOP_BASE("Clients").create(
        [
            {
                fields: {
                    "Project Name": project_name,
                    Summary: summary,
                    "Skills Needed": skills_needed,
                    "Do you have any specs?": specs,
                    Name: name,
                    Email: email,
                    Handle: handle,
                    "How did you hear about the guild?": about_guild,
                    "Anything else you would like the guild to know?": to_know,
                    "Booking Slot 1": slot_1,
                    "Booking Slot 2": slot_2,
                    "Booking Slot 3": slot_3,
                    "Transaction Hash": transaction_hash,
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

DAOSHOP_ROUTER.post("/mongo", async (req, res) => {
    let {
        project_name,
        summary,
        skills_needed,
        specs,
        name,
        email,
        handle,
        about_guild,
        to_know,
        slot_1,
        slot_2,
        slot_3,
        transaction_hash,
    } = req.body;

    try {
        let Discord = req.DISCORD;
        let embed = new Discord.MessageEmbed()
            .setColor("#ff3864")
            .setTitle(project_name || "NaN")
            .setURL(`https://etherscan.io/tx/${transaction_hash}`)
            .setAuthor(name || "NaN")
            .addFields(
                {
                    name: "Specs",
                    value: specs || "NaN",
                },
                {
                    name: "Skills Needed",
                    value: skills_needed || "NaN",
                },
                {
                    name: "Contact",
                    value: `[${email}][${handle || "NaN"}]`,
                },
                {
                    name: "Preferred Consultation Times",
                    value: `[${slot_1}][${slot_2}][${slot_3}]`,
                }
            )
            .setTimestamp();

        req.CLIENT.guilds.cache
            .get(process.env.GUILD_ID)
            .channels.cache.get(process.env.DAOSHOP_CHANNEL_ID)
            .send(embed);
    } catch (err) {
        console.log("Error");
    }

    const client = new Clients({
        project_name,
        summary,
        skills_needed,
        specs,
        name,
        email,
        handle,
        about_guild,
        to_know,
        slot_1,
        slot_2,
        slot_3,
        transaction_hash,
    });

    client
        .save()
        .then((data) => {
            console.log("Success - Mongo");
            res.send("Success - Mongo");
        })
        .catch((err) => {
            console.log(err);
            res.send("Error - Mongo");
        });
});

module.exports = DAOSHOP_ROUTER;
