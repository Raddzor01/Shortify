const fs = require('fs');
const { Client } = require('pg');

const db = new Client(JSON.parse(fs.readFileSync('./db-config.json', 'utf8')));

db.connect();

const sqlScript = fs.readFileSync('db/dump.sql', 'utf8');

db.query(sqlScript, (err, res) => {
    if (err) {
      console.error('Ошибка выполнения SQL-скрипта', err);
      client.end();
    } else {
      console.log('База данных успешно восстановлена');
    }
  });

module.exports = db;