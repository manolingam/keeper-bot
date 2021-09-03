const dotenv = require('dotenv');

const createServer = require('../server');
const roleClaim = require('../features/role-claim');
const molochRoleClaim = require('../temp/verify');

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
    //   .commands.cache.get('881470766019919872')
    //   .delete();

    await client.guilds.cache
      .get(process.env.GUILD_ID)
      ?.commands.permissions.set({
        fullPermissions: [
          {
            id: '881590070791008280',
            permissions: [
              {
                id: process.env.MEMBER_ROLE_ID,
                type: 'ROLE',
                permission: true
              }
            ]
          },
          {
            id: '881590070791008279',
            permissions: [
              {
                id: process.env.MEMBER_ROLE_ID,
                type: 'ROLE',
                permission: true
              }
            ]
          },
          {
            id: '881590070791008276',
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
    molochRoleClaim(client);

    createServer();
  }
};
