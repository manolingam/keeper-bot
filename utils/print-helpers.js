//These helper fns can be made to more useful to other commands later on.
const createListString = (member) => {
  return `${member.user.username} is ${
    member.roles.cache.has(process.env.AVAILABLE_ROLE_ID)
      ? "**Available**"
      : "**Unavailable**"
  }
`;
};
const createField = (label, members) => {
  return {
    name: label,
    value: members.map((m) => createListString(m)).join(""),
  };
};
const createFields = (label, members) => {
  if (members.length <= 12) {
    return [createField(label, members)];
  } else {
    return [
      createField(label, members.slice(0, 12)),
      ...createFields("Cont'd", members.slice(12)),
    ];
  }
};
const initPrinter = (Discord, message) => {
  return ({ title, description, fields }) => {
    const embed = new Discord.MessageEmbed().setColor("#ff3864").setTimestamp();
    if (title) {
      embed.setTitle(title);
    }
    if (description) {
      embed.setDescription(description);
    }
    if (fields) {
      embed.addFields(fields);
    }
    message.channel.send(embed);
  };
};

module.exports = { initPrinter, createFields };
