module.exports = {
  name: 'find-email',
  description: 'Finds the email address of a member with possible matches.',
  execute(Discord, message, raidcentral_base, args) {
    if (args.length < 3) {
      let embed = new Discord.MessageEmbed()
        .setDescription('Missing arguments. Check `@keeper help find-email`')
        .setColor('#ff3864');
      return message.channel.send(embed);
    }

    let name = args[2];
    let results = [];

    raidcentral_base('Member Registry')
      .select({
        view: 'Grid view'
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function (record) {
            if (record.get('Name').toLowerCase().includes(name))
              results.push({
                name: record.get('Name'),
                value: record.get('Email')
              });
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
          let embed = new Discord.MessageEmbed()
            .setDescription(
              results.length > 0
                ? 'Found the following matches.'
                : 'Could not find a match.'
            )
            .setColor('#ff3864')
            .addFields(results);

          message.channel.send(embed);
        }
      );
  }
};
