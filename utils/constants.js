const PREFIX = '@keeper';
const HELP_MESSAGE = [
  {
    name: 'create-raid',
    value: 'Creates a raid channel.'
  },
  {
    name: 'create-rip',
    value: 'Creates a rip channel.'
  },
  {
    name: 'create-camp',
    value: 'Creates a camp channel.'
  },
  {
    name: 'available',
    value: "Sets member's own availability."
  },
  {
    name: 'available-status',
    value: "Checks and displays member's availability."
  },
  {
    name: 'available-who',
    value: 'Return all available members by role(s).'
  },
  {
    name: 'available-grep',
    value: 'Returns available guild members by role that matches a substring.'
  },
  {
    name: 'available-full',
    value: 'Returns available and unavailable guild members by role(s).'
  },
  {
    name: 'available-summary',
    value:
      'Displays a summary of number of members available for raiding under each role.'
  },
  {
    name: 'role-stats',
    value: 'Returns number of people assigned to each role.'
  },
  {
    name: 'inactive-stats',
    value: 'Returns total inactive members & their usernames.'
  },
  {
    name: 'valhalla',
    value: 'Sends a channel to Valhalla.'
  },
  {
    name: 'treasury',
    value: 'Used to record a direct fund transfer to the guild.'
  },
  {
    name: 'gas-info',
    value: 'Returns live gas prices.'
  },
  {
    name: 'timezones',
    value: 'Returns the current time in different timezones.'
  }
];

let ROLES = [
  { name: 'AngryDwarf', id: process.env.ANGRYDWARF_ID },
  {
    name: 'TavernKeeper',
    id: process.env.TAVERNKEEPER_ID
  },
  {
    name: 'Archer',
    id: process.env.ARCHER_ID
  },
  {
    name: 'Bard',
    id: process.env.BARD_ID
  },
  {
    name: 'Cleric',
    id: process.env.CLERIC_ID
  },
  {
    name: 'Druid',
    id: process.env.DRUID_ID
  },
  {
    name: 'Healer',
    id: process.env.HEALER_ID
  },
  {
    name: 'Hunter',
    id: process.env.HUNTER_ID
  },
  {
    name: 'Warrior',
    id: process.env.WARRIOR_ID
  },
  {
    name: 'Paladin',
    id: process.env.PALADIN_ID
  },
  {
    name: 'Monk',
    id: process.env.MONK_ID
  },
  {
    name: 'Alchemist',
    id: process.env.ALCHEMIST_ID
  },
  {
    name: 'Necromancer',
    id: process.env.NECROMANCER_ID
  },
  {
    name: 'Ranger',
    id: process.env.RANGER_ID
  },
  {
    name: 'Rogue',
    id: process.env.ROGUE_ID
  },
  {
    name: 'Scribe',
    id: process.env.SCRIBE_ID
  },
  {
    name: 'Wizard',
    id: process.env.WIZARD_ID
  }
];

exports.ROLES = ROLES;
exports.PREFIX = PREFIX;
exports.HELP_MESSAGE = HELP_MESSAGE;
