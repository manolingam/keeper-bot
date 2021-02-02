const express = require('express');

const HIREUS_V2_ROUTER = express.Router();

HIREUS_V2_ROUTER.post('/consultation', async (req, res) => {
  let {
    name,
    email,
    bio,
    telegramHandle,
    discordHandle,
    twitterHandle,
    contactType,
    projectType,
    projectSpecs,
    specsLink,
    projectName,
    projectDescription,
    servicesRequired,
    selectedDay,
    budgetRange,
    specificInfo,
    priority,
    transaction_hash
  } = req.body;

  if (selectedDay === '') {
    selectedDay = new Date().toLocaleDateString();
  } else {
    selectedDay = new Date(selectedDay).toLocaleDateString();
  }

  await req.RAID_CENTRAL_V2_BASE('Raids v2').create(
    [
      {
        fields: {
          Name: name,
          Email: email,
          Bio: bio,
          'Telegram Handle': telegramHandle,
          'Discord Handle': discordHandle,
          'Twitter Handle': twitterHandle,
          'Preferred Contact Method': contactType,
          'Project Type': projectType,
          'Project Specs': projectSpecs,
          'Specs Link': specsLink,
          'Project Name': projectName,
          'Project Description': projectDescription,
          'Services Required': servicesRequired,
          'Expected Deadline': selectedDay,
          'Budget Range': budgetRange,
          'Additional Information': specificInfo,
          Priorities: priority,
          'Consultation Hash': transaction_hash
        }
      }
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        return res.json('ERROR');
      }
      records.forEach(function (record) {
        let id = record.getId();
        return res.json(id);
      });
    }
  );

  // try {
  //     let Discord = req.DISCORD;
  //     let embed = new Discord.MessageEmbed()
  //         .setColor("#ff3864")
  //         .setTitle(project_name)
  //         .setURL(`https://etherscan.io/tx/${transaction_hash}`)
  //         .setAuthor(name)
  //         .addFields(
  //             {
  //                 name: "Project Type",
  //                 value: project_type,
  //             },
  //             {
  //                 name: "Budget",
  //                 value: budget,
  //             },
  //             {
  //                 name: "Specs",
  //                 value: specs,
  //             },
  //             {
  //                 name: "Skills Needed",
  //                 value: skills_needed,
  //             },
  //             {
  //                 name: "Priorities",
  //                 value: priorities,
  //             },
  //             {
  //                 name: "Relevant Link",
  //                 value: link || "NaN",
  //             },
  //             {
  //                 name: "Contact",
  //                 value: `[${email}][${handle || "NaN"}]`,
  //             },
  //             {
  //                 name: "Expected Delivery Date",
  //                 value: completion_date || "NaN",
  //             }
  //         )
  //         .setTimestamp();

  //     req.CLIENT.guilds.cache
  //         .get(process.env.GUILD_ID)
  //         .channels.cache.get(process.env.CLIENT_SUBMISSION_CHANNEL_ID)
  //         .send(embed);
  // } catch (err) {
  //     console.log("Error", err);
  // }
});

HIREUS_V2_ROUTER.post('/feedback', async (req, res) => {
  let { raidID, feedbackOne, feedbackTwo, rating } = req.body;

  await req.RAID_CENTRAL_V2_BASE('Raids v2').update(
    [
      {
        id: raidID,
        fields: {
          'How did you hear about us?': feedbackOne,
          'What can be better?': feedbackTwo,
          Rating: Number(rating)
        }
      }
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        res.json('ERROR');
        return;
      }
      records.forEach(function (record) {
        res.json('SUCCESS');
      });
    }
  );
});

module.exports = HIREUS_V2_ROUTER;
