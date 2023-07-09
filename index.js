const http = require('http');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const logFilePath = path.join(__dirname, 'logs', 'server.log');

const db = require('db-deploy.js');

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'text/html'
            })

            res.end(data);
        })
    } else if (req.url === '/css/style.css') {
        fs.readFile(path.join(__dirname, 'public', 'css/style.css'), (err, data) => {
            if (err) {
                throw err;
            }

            res.writeHead(200, {
                'Content-Type': 'text/css'
            });

            res.end(data);
        });
    } else if (req.url === '/js/script.js') {
        fs.readFile(path.join(__dirname, 'public', 'js/script.js'), (err, data) => {
            if (err) {
                throw err;
            }

            res.writeHead(200, {
                'Content-Type': 'application/javascript'
            });

            res.end(data);
        });
    } else if (req.method === 'POST' && req.url === '/api/data') {
        let requestBody = '';
        req.on('data', chunk => {
            requestBody += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const data = JSON.parse(requestBody);
                const inputValue = data.data;

                if (!isURL(inputValue)) {
                    const response = { message: undefined };
                    res.end(JSON.stringify(response));
                    return;
                }

                const id = generateId();
                let queryText = 'INSERT INTO links (id, link) VALUES ($1, $2)';
                let queryValues = [id, inputValue];

                try {
                    await db.query(queryText, queryValues);
                    logToFile('INSERT completed successfully');
                } catch (err) {
                    logToFile('INSERT execution error: ' + err.message);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }

                const response = { message: id };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));
            } catch (err) {
                logToFile('Query execution error: ' + err.message);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
        });
    } else {
        try {
            const id = req.url.slice(1);
            const link = await findLinkById(id);
            if (link === '404') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1 style="text-align: center;">404 Not Found</h1>');
                return;
            }
            res.writeHead(302, { 'Location': link });
            res.end();
        } catch (err) {
            logToFile('Query execution error: ' + err.message);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    }

})

function isURL(str) {
    const urlPattern = /^(http?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,6})(\/[\w.-]*)*\/?$/;
    return urlPattern.test(str);
}

function logToFile(logMessage) {
    fs.access(logFilePath, (error) => {
        if (error) {
            fs.mkdir(path.join(__dirname, 'logs'), (error) => {
                if (error) {
                    console.error('Error while creating directory: ', error);
                } else {
                    fs.writeFile(logFilePath, '', (error) => {
                        if (error) {
                            console.error('Error while creating file:', error);
                        } else {
                            console.log(`Log file created in ${logFilePath}`);
                        }
                    });
                }
            });
        }
        const formattedLogMessage = `[${new Date().toISOString()}] ${logMessage}\n`;

        fs.appendFile(logFilePath, formattedLogMessage, (err) => {
            if (err) {
                console.error('Logging error: ', err);
            }
        });
    });
}

function generateId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';

    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters.charAt(randomIndex);
    }

    return id;
}

async function findLinkById(id) {
    try {
        const result = await db.query('SELECT link FROM links WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            const link = result.rows[0].link;
            return link;
        } else {
            return '404';
        }
    } catch (err) {
        logToFile('Query execution error: ' + err.message);
        throw err;
    }
}

server.listen(3000, () => {
    console.log('Successful server startup');
    logToFile('Server has been started');
});

db.connect()
    .then(() => {
        logToFile('Successful connection to PostgreSQL');
    })
    .catch((err) => {
        logToFile('PostgreSQL connection error: ' + JSON.stringify(err));
    });
