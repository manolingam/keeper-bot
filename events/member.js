const entryCheck = require('../features/portcullis-captcha');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    // executes the portcullis guard
    entryCheck(member);
  }
};
