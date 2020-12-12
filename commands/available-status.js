module.exports = {
  name: "available-status",
  description: "Allows a member to see their current availability",
  execute(Discord, message) {
    const isAvailable = message.member.roles.cache.has(
      process.env.AVAILABLE_ROLE_ID
    );
    const embed = new Discord.MessageEmbed()
      .setColor("#ff3864")
      .setTimestamp()
      .setTitle(
        isAvailable
          ? "You are available for raids."
          : "You are not available for raids."
      )
      .addFields({
        name: "Want to change your availability?",
        value: `Copy & Paste this command:
         ${
           isAvailable
             ? "``!keeper available false``"
             : "``!keeper available true``"
         }`,
      });
    message.channel.send(embed);
  },
};
