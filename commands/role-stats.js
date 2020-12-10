module.exports = {
    name: "role-stats",
    description: "Returns total members in each role",
    execute(Discord, message) {
        let roles = [];
        let filterRoles = [
            "@everyone",
            "nodered",
            "1up",
            "Nurevam",
            "RaidGuild",
            "Fantastic12",
            "Simple Poll",
        ];
        message.guild.roles.cache.forEach((role) => {
            if (!filterRoles.includes(role.name)) {
                let count = message.guild.roles.cache.get(role.id).members.size;
                roles.push({ name: role.name, value: `${count} people` });
            }
        });

        let embed = new Discord.MessageEmbed()
            .setColor("#ff3864")
            .setTimestamp()
            .addFields(roles);

        message.channel.send(embed);
    },
};
