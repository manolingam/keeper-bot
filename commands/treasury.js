module.exports = {
    name: "treasury",
    description: "Adds info about a direct fund transfer to the guild.",
    execute(message, treasury_base) {
        let split = message.content.split('"');

        if (split.length < 2 || split[2] === "")
            return message.channel.send(
                "Command is not formatted properly! Check **!keeper help treasury**."
            );

        let values = {};

        values["desc"] = split[1];
        values["link"] = split[2].trim();

        treasury_base("Direct Transfers").create(
            [
                {
                    fields: {
                        Description: values["desc"],
                        "Etherscan Link": values["link"],
                    },
                },
            ],
            function (err, records) {
                if (err) {
                    console.error(err);
                    return;
                }
                records.forEach(function (record) {
                    console.log(record.getId());
                    return message.channel.send("Data recorded!");
                });
            }
        );
    },
};
