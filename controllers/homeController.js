import db from '../db/db-init.js';

async function findLink(req, res) {
    const url = req.url.slice(1);

    db.query('SELECT url FROM links WHERE id = $1', [url], (err, result) => {
        try {
            if (err)
                throw err;

            if (!result || result.rows.length === 0)
                res.send('<html><body style="text-align: center"><h1>404 Not Found</h1></body></html>');
            else
                res.redirect(result.rows[0].url);
        } catch (err) {
            res.status(500).send('Internal Server Error');
        }
    });
};

export default findLink;