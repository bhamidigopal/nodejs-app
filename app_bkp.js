const { Client } = require('pg');
const fs = require('fs');
const csv = require('csv-parser');
const { v4: uuidv4 } = require('uuid');

const database = require('./config/database');

const client = new Client({
  user: database.user,
  password: database.password,
  host: database.host,
  port: database.port,
  database: database.database
});

async function insertData() {
  try {
    await client.connect();
    fs.createReadStream('input2.csv')
      .pipe(csv())
      .on('data', async (row) => {
        const id = uuidv4();
        const data = row.data;
        const query = `INSERT INTO newtable (id, data) VALUES ('${id}', '${data}')`;
        await client.query(query);
        console.log(`Inserted data with id ${id} and data ${data} into newtable`);
      });
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

insertData();
