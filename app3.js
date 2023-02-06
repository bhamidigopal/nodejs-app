const fs = require('fs');
const csv = require('csv-parser');

const firstCsv = 'file1.csv';
const secondCsv = 'file2.csv';
const outputFile = 'output.csv';

const data = {};

fs.createReadStream(firstCsv)
  .pipe(csv())
  .on('data', (row) => {
    data[row.name] = row.id;
  })
  .on('end', () => {
    const output = [];
    let badRecords = [];
    fs.createReadStream(secondCsv)
      .pipe(csv())
      .on('data', (row) => {
        const id = data[row.name];
        if (!id) {
          badRecords.push(`${row.sid},${row.name}`);
        } else {
          output.push({ sid: row.sid, name: row.name, id });
        }
      })
      .on('end', () => {
        if (badRecords.length > 0) {
          console.log(`No match found for the following records:`);
          console.log(badRecords.join('\n'));
        }
        const header = 'sid,name,id\n';
        const outputCsv = header + output.map((row) => `${row.sid},${row.name},${row.id}`).join('\n');
        fs.writeFileSync(outputFile, outputCsv);
        console.log(`CSV files merged successfully. Output written to ${outputFile}`);
      });
  });
