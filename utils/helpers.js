const welcomeMessages = (member) => {
  const randomGreetings = [
    `Glad you are here, <@${member.id}>`,
    `Everyone welcome <@${member.id}>`,
    `Welcome, <@${member.id}>`,
    `Good to see you, <@${member.id}>`,
    `<@${member.id}> joined the party.`,
    `<@${member.id}> is here.`,
    `<@${member.id}> just landed.`,
    `Welcome <@${member.id}>. Say hi!`,
    `Welcome, <@${member.id}>. Stay awhile and listen.`,
    `Welcome, <@${member.id}>. We were expecting you ( ͡° ͜ʖ ͡°)`,
    `Welcome <@${member.id}>. Leave your weapons by the door.`,
    `Big <@${member.id}> showed up!`,
    `<@${member.id}> just showed up. Hold my beer.`,
    `Challenger approaching - <@${member.id}> has appeared!`,
    `It's a bird! It's a plane! Nevermind, it's just <@${member.id}>.`,
    `It's <@${member.id}>, praise the sun!`,
    `Cheers, love! <@${member.id}>'s here!`,
    `We've been expecting you <@${member.id}>`,
    `<@${member.id}> has joined the server! It's super effective!`,
    `<@${member.id}> is here, as the prophecy foretold.`,
    `Ready player <@${member.id}>`
  ];

  var greeting =
    randomGreetings[Math.floor(Math.random() * randomGreetings.length)];

  return greeting;
};

exports.welcomeMessages = welcomeMessages;
