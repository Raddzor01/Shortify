import pg from 'pg';
import fs from 'fs';

const { Pool } = pg;

const db = new Pool(JSON.parse(fs.readFileSync('db/pool-config.json', 'utf8')));

export default db;