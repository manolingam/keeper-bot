module.exports = {
    name: "inactive-stats",
    description: "Returns total inactive members & their usernames.",
    execute(Discord, message) {
        let members = [];
        message.guild.roles.cache
            .get(process.env.INACTIVE_ROLE_ID)
            .members.forEach((member) => {
                members.push(member.user.username);
            });

        let embed = new Discord.MessageEmbed()
            .setColor("#ff3864")
            .setTimestamp()
            .addFields(
                {
                    name: "Total Inactive",
                    value: members.length,
                },
                {
                    name: "Inactive Members",
                    value: members,
                }
            );

        message.channel.send(embed);
    },
};
