import { nanoid } from 'nanoid';
import db from '../db/db-init.js';

const MAX_ATTEMPTS = 100;

async function saveLink(req, res) {
    try {
        const data = req.body.data;

        if (!isURL(data)) {
            const response = { message: undefined };
            return res.send(JSON.stringify(response));
        }

        let id;
        let attempts = 0;

        while (attempts < MAX_ATTEMPTS) {
            id = nanoid(5);

            const countResult = await db.query('SELECT EXISTS(SELECT id FROM links WHERE id = $1)', [id]);
            const recordExists = countResult.rows[0].exists;

            if (!recordExists) {
                break;
            }
            attempts++;
        }

        if (attempts === MAX_ATTEMPTS) {
            throw new Error('Unable to find a unique id.');
        }


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
