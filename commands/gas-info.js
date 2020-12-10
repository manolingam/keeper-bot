module.exports = {
    name: "gas-info",
    description: "Returns gas price stats.",
    execute(Discord, message, axios) {
        axios
            .get("https://ethgasstation.info/api/ethgasAPI.json")
            .then((res) => {
                let embed = new Discord.MessageEmbed()
                    .setColor("#ff3864")
                    .setTimestamp()
                    .addFields(
                        {
                            name: "Fast",
                            value: res.data.fast / 10,
                        },
                        {
                            name: "Standard",
                            value: res.data.average / 10,
                        },
                        {
                            name: "Safelow",
                            value: res.data.safeLow / 10,
                        }
                    );
                message.channel.send(embed);
            })
            .catch((err) =>
                message.channel.send(`Something went wrong. Try again later!`)
            );
    },
};
