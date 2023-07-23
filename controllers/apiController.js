import { nanoid } from 'nanoid';
import db from '../db/db-init.js';

async function saveLink(req, res) {
    try {
        const data = req.body.data;

        if (!isURL(data)) {
            const response = { message: undefined };
            return res.send(JSON.stringify(response));
        }

        const id = nanoid(5);
        await db.query('INSERT INTO links (id, url) VALUES ($1, $2)', [id, data]);

        const response = { message: id };
        res.send(JSON.stringify(response));
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
};

function isURL(str) {
    return /^(https?:\/\/)?\w+(\.\w+)+.*$/.test(str);
  }

export default saveLink;
