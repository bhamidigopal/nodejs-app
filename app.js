
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


//console.log("Before reading from file");
 const csvData = fs.readFileSync('input.csv', 'utf8');
//console.log("After reading file", csvData);



const records = [];
  fs.createReadStream('input.csv')
    .pipe(csv())
    .on('data', (data) => {
      records.push(data);
    })
    .on('end', () => {
     // console.log("RR",records);
      for (const record of records) {


//
  const id1 = uuidv4();
//  const data = row.data;
//  const query = `INSERT INTO newtable (id, data) VALUES ('${id}', '${data}')`;


//
        const {  data1, data2 } = record;
        const json = { data1, data2 };

        const query = `
          INSERT INTO newtable (id, column2)
          VALUES ($1, $2)
        `;

     //   console.log('Query:', query);
//console.log('Parameters:', [id, JSON.stringify(json)]);

         client.query(query, [id1, JSON.stringify(json)]);


    }

    });



client.connect()
  .then(() => {
    const query = 'SELECT * FROM newtable';
    return client.query(query);
  })
  .then(result => {
    console.log(result.rows);
  })
  .catch(error => {
    console.error(error);
  });


 // console.log("Inserted into DB");
