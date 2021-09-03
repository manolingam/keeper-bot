const { Client } = require('pg');
const airtable = require('airtable');
const dotenv = require('dotenv');

dotenv.config();

const initPgClient = () => {
  const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_SECRET,
    port: 5432
  });
  return client;
};

const initAirtableClient = () => {
  airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.API_KEY
  });

  const base = airtable.base(process.env.RAID_CENTRAL_V2_BASE_ID);

  const raids_v2_table = base('Raids v2');

  return raids_v2_table;
};

module.exports = { initPgClient, initAirtableClient };
