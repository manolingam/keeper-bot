const { Client } = require('pg');
const airtable = require('airtable');
const dotenv = require('dotenv');

dotenv.config();

const SECRETS = {
  ROUTE_ACCESS_KEY: process.env.ROUTE_ACCESS_KEY,
  TOKEN: process.env.TOKEN,
  PG_DB: process.env.PG_DB,
  PG_HOST: process.env.PG_HOST,
  PG_SECRET: process.env.PG_SECRET,
  PG_USER: process.env.PG_USER,
  API_KEY: process.env.API_KEY,
  RAID_CENTRAL_V2_BASE_ID: process.env.RAID_CENTRAL_V2_BASE_ID,
  GUILD_ID: process.env.GUILD_ID,
  OWNER_ID: process.env.OWNER_ID,
  CLIENT_ID: process.env.CLIENT_ID,
  BOT_ID: process.env.BOT_ID,
  UNLOCK_CHANNEL_ID: process.env.UNLOCK_CHANNEL_ID,
  SMART_ESCROW_CHANNEL_ID: process.env.SMART_ESCROW_CHANNEL_ID,
  CLIENT_SUBMISSION_CHANNEL_ID: process.env.CLIENT_SUBMISSION_CHANNEL_ID,
  BOT_CENTER_CHANNEL_ID: process.env.BOT_CENTER_CHANNEL_ID,
  WHISPERS_CHANNEL_ID: process.env.WHISPERS_CHANNEL_ID,
  LIBRARY_CHANNEL_ID: process.env.LIBRARY_CHANNEL_ID,
  RIP_DISCUSSIONS_CHANNEL_ID: process.env.RIP_DISCUSSIONS_CHANNEL_ID,
  START_HERE_CHANNEL_ID: process.env.START_HERE_CHANNEL_ID,
  TAVERN_CHANNEL_ID: process.env.TAVERN_CHANNEL_ID,
  COMMAND_CENTER_ID: process.env.COMMAND_CENTER_ID,
  AVAILABLE_ROLE_ID: process.env.AVAILABLE_ROLE_ID,
  INACTIVE_ROLE_ID: process.env.INACTIVE_ROLE_ID,
  MEMBER_ROLE_ID: process.env.MEMBER_ROLE_ID,
  TREASURY_BASE_ID: process.env.TREASURY_BASE_ID,
  VALHALLA_6_21_CHANNEL_ID: process.env.VALHALLA_6_21_CHANNEL_ID,
  COHORT_ROLE_ID: process.env.COHORT_ROLE_ID,
  RAID_SWAP_ALERT_CHANNEL_ID: process.env.RAID_SWAP_ALERT_CHANNEL_ID,
  MOLOCH_SOLDIER_ROLE_ID: process.env.MOLOCH_SOLDIER_ROLE_ID,
  COHORT_SUBMISSIONS_CHANNEL_ID: process.env.COHORT_SUBMISSIONS_CHANNEL_ID,
  HQ_ANNOUNCEMENTS_CHANNEL_ID: process.env.HQ_ANNOUNCEMENTS_CHANNEL_ID,
  ALLOW_BOTS: process.env.ALLOW_BOTS
};

const initPgClient = () => {
  const client = new Client({
    user: SECRETS.PG_USER,
    host: SECRETS.PG_HOST,
    database: SECRETS.PG_DB,
    password: SECRETS.PG_SECRET,
    port: 5432
  });
  return client;
};

const initAirtableClient = () => {
  airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: SECRETS.API_KEY
  });

  const base = airtable.base(SECRETS.RAID_CENTRAL_V2_BASE_ID);

  const raids_v2_table = base('Raids v2');

  return raids_v2_table;
};

module.exports = { SECRETS, initPgClient, initAirtableClient };
