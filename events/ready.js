const dotenv = require('dotenv');

const createServer = require('../server');
const roleClaim = require('../features/role-claim');

dotenv.config();

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}!`);

    // ----- delete global slash commands ----

    // console.log(await client.application.commands.fetch());
    // await client.application.commands.cache.get('863755341111492619').delete();

    // ----- delete guild slash commands ----

    // const cmds = await client.guilds.cache
    //   .get(process.env.GUILD_ID)
    //   .commands.fetch();
    // console.log(cmds);
    // await client.guilds.cache
    //   .get(process.env.GUILD_ID)
    //   .commands.cache.get('881229188487577632')
    //   .delete();

    await client.guilds.cache
      .get(process.env.GUILD_ID)
      ?.commands.permissions.set({
        fullPermissions: [
          {
            id: '881399095338614804',
            permissions: [
              {
                id: process.env.MEMBER_ROLE_ID,
                type: 'ROLE',
                permission: true
              }
            ]
          },
          {
            id: '881405211506245715',
            permissions: [
              {
                id: process.env.MEMBER_ROLE_ID,
                type: 'ROLE',
                permission: true
              }
            ]
          },
          {
            id: '881405211506245712',
            permissions: [
              {
                id: process.env.MEMBER_ROLE_ID,
                type: 'ROLE',
                permission: true
              }
            ]
          }
        ]
      });

    roleClaim(client);

    createServer(client);
  }
};
