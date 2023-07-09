const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        try {
            const data = await readFileAsync(path.join(__dirname, 'public', 'index.html'));
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        } catch (err) {
            handleError(res, err);
        }
    } else if (req.url === '/css/style.css') {
        try {
            const data = await readFileAsync(path.join(__dirname, 'public', 'css/style.css'));
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        } catch (err) {
            handleError(res, err);
        }
    } else if (req.url === '/js/script.js') {
        try {
            const data = await readFileAsync(path.join(__dirname, 'public', 'js/script.js'));
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        } catch (err) {
            handleError(res, err);
        }
    } else if (req.method === 'POST' && req.url === '/api/data') {
        try {
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
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(response));
                        return;
                    }

                    const id = generateId();
                    await writeLinkToFile(id, inputValue);
                    const response = { message: id };
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(response));
                } catch (err) {
                    handleError(res, err);
                }
            });
        } catch (err) {
            handleError(res, err);
        }
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
            handleError(res, err);
        }
    }

});

function isURL(str) {
    const urlPattern = /^(http?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,6})(\/[\w.-]*)*\/?$/;
    return urlPattern.test(str);
}

function logToFile(logMessage) {
    fs.access(logFilePath, (error) => {
        if (error) {

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
    const filePath = path.join(__dirname, 'links.txt');
    const data = await readFileAsync(filePath);

    const lines = data.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            const [savedId, link] = line.split(',');
            if (savedId === id) return link;
        }
    }

    return '404';
}

async function writeLinkToFile(id, link) {
    const data = `${id},${link}\n`;
    const filePath = path.join(__dirname, 'links.txt');
    await appendFileAsync(filePath, data);
    logToFile('Entry successfully added to the file.');
}

function readFileAsync(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function appendFileAsync(filePath, data) {
    return new Promise((resolve, reject) => {
        fs.appendFile(filePath, data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function handleError(res, err) {
    logToFile('Query execution error: ' + err.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
}

server.listen(3000, () => {
    console.log('Successful server startup');
    logToFile('Server has been started');
});
