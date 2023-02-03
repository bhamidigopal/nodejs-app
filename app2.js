const { Client } = require('pg');
const database = require('./config/database');

const client = new Client({
  user: database.user,
  password: database.password,
  host: database.host,
  port: database.port,
  database: database.database
});

client.connect();

client.query('SELECT * FROM newtable', (err, res) => {
  console.log(err ? err.stack : res.rows);
  client.end();
});
