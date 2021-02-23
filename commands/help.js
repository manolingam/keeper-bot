module.exports = {
  name: 'help',
  description: 'Returns the list of available commands for use.',
  execute(Discord, message, args) {
    const CREATE_RAID = `To create a raid channel, use **@keeper create-raid <project-name> <link-to-proposal> <party-member-1> <party-member-2>**. You don't need to mention yourself as a party member as it's default.`;
    const CREATE_RIP = `To create a rip channel, use **@keeper create-rip <project-name> <link-to-proposal> <party-member-1> <party-member-2>**. You don't need to mention yourself as a party member as it's default.`;
    const CREATE_CAMP = `To create a camp channel, use **@keeper create-camp <project-name> <link-to-proposal> <party-member-1> <party-member-2>**. You don't need to mention yourself as a party member as it's default.`;
    const AVAILABLE =
      "Sets member's own availability for raids. Use `@keeper available <true> |OR| <false>`.";
    const AVAILABLE_STATUS =
      "Checks and displays member's availability. Use `@keeper availability-status` ";
    const AVAILABLE_WHO =
      'Searches the guild for all **available** members by role(s). Use `@keeper available-who <TAGNAME(S)>`. Can handle multiple queries. Case insensitive. Searches for role (ex. Paladin) OR profession (BackEndDev). Does not return unavailable members.';
    const AVAILABLE_GREP =
      'Searches for available guild members by role with a substring. Use `@keeper available-grep <SUBSTRING>`. Only searches one substring. Does not return unavailble members.';
    const AVAILABLE_FULL =
      'Searches the guild for all **available** and **unavailable** members by role(s). Use `@keeper available-full <TAGNAME(S)>`. Can handle multiple queries. Case insensitive. Searches for Role (ex. Paladin) OR profession (BackEndDev).';
    const VALHALLA = `To send a channel to Valhalla, use **@keeper valhalla <mention channel>**.`;
    const ROLE_STATS = `Returns the total number of members assigned to each role.`;
    const INACTIVE_STATS = `Returns total inactive members & their usernames.`;
    const TREASURY = `To record a direct transfer into the DAO bank, use **@keeper treasury "brief description" etherscan-link**.`;
    const GAS_INFO = `Returns the live gas price stats.`;
    const TIMEZONES = `Returns the current time in different timezones.`;
    const AVAILABLE_SUMMARY = `Displays a summary of number of members available for raiding under each role.`;
    const FIND_EMAIL =
      'Finds the email address of a member with possible matches. Use `@keeper find-email <person-name>`';

    if (args.length < 3)
      return message.channel.send('Missing command! Help with what?');

    switch (args[2]) {
      case 'create-raid':
        return message.channel.send(
          new Discord.MessageEmbed()

            .setDescription(CREATE_RAID)
            .setColor('#ff3864')
        );
      case 'create-rip':
        return message.channel.send(
          new Discord.MessageEmbed()

            .setDescription(CREATE_RIP)
            .setColor('#ff3864')
        );
      case 'create-camp':
        return message.channel.send(
          new Discord.MessageEmbed()

            .setDescription(CREATE_CAMP)
            .setColor('#ff3864')
        );
      case 'available':
        return message.channel.send(
          new Discord.MessageEmbed()

            .setDescription(AVAILABLE)
            .setColor('#ff3864')
        );
      case 'available-status':
        return message.channel.send(
          new Discord.MessageEmbed()
            .setDescription(AVAILABLE_STATUS)
            .setColor('#ff3864')
        );
      case 'available-who':
        return message.channel.send(
          new Discord.MessageEmbed()
            .setDescription(AVAILABLE_WHO)
            .setColor('#ff3864')
        );
      case 'available-grep':
        return message.channel.send(
          new Discord.MessageEmbed()
            .setDescription(AVAILABLE_GREP)
            .setColor('#ff3864')
        );
      case 'available-full':
        return message.channel.send(
          new Discord.MessageEmbed()
            .setDescription(AVAILABLE_FULL)
            .setColor('#ff3864')
        );
      case 'available-summary':
        return message.channel.send(
          new Discord.MessageEmbed()
            .setDescription(AVAILABLE_SUMMARY)
            .setColor('#ff3864')
        );
      case 'role-stats':
        return message.channel.send(
          new Discord.MessageEmbed()

            .setDescription(ROLE_STATS)
            .setColor('#ff3864')
        );
      case 'inactive-stats':
        return message.channel.send(
          new Discord.MessageEmbed()

            .setDescription(INACTIVE_STATS)
            .setColor('#ff3864')
        );
      case 'find-email':
        return message.channel.send(
          new Discord.MessageEmbed()
            .setDescription(FIND_EMAIL)
            .setColor('#ff3864')
        );
      case 'treasury':
        return message.channel.send(
          new Discord.MessageEmbed()
            .setDescription(TREASURY)
            .setColor('#ff3864')
            .setFooter(
              'Quotation marks "" are required enclosing the description.'
            )
        );
      case 'valhalla':
        return message.channel.send(
          new Discord.MessageEmbed()

            .setDescription(VALHALLA)
            .setColor('#ff3864')
        );
      case 'gas-info':
        return message.channel.send(
          new Discord.MessageEmbed()
            .setDescription(GAS_INFO)
            .setColor('#ff3864')
        );
      case 'timezones':
        return message.channel.send(
          new Discord.MessageEmbed()
            .setDescription(TIMEZONES)
            .setColor('#ff3864')
        );
      default:
        return message.channel.send(
          'No command found on that name. Check `@keeper help` for the list of available commands.'
        );
    }
  }
};
