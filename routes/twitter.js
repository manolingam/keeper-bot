const express = require("express");

const TWITTER_ROUTER = express.Router();

TWITTER_ROUTER.post("/", (req, res) => {
    let tweet_message = "Tweet incoming, share it up 🗣\n" + req.body.content;

    req.CLIENT.guilds.cache
        .get(process.env.GUILD_ID)
        .channels.cache.get("685230036332445696")
        .send(tweet_message);

    res.send("Received");
});

module.exports = TWITTER_ROUTER;
