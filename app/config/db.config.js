const { Client } = require('pg');

const client = new Client({
  user: 'XXXX',
  host: 'XXXX',
  database: 'XXXX',
  password: 'XXXX',
  port: 5432,
});

client.connect();

module.exports = client;