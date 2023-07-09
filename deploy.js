const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'logs', 'server.log');

fs.mkdir(path.join(__dirname, 'logs'), (error) => {
    if (error) {
        console.error('Error while creating directory: ', error);
    } else {
        fs.writeFile(logFilePath, '', (error) => {
            if (error) {
                console.error('Error while creating file:', error);
            }
        });
    }
});

fs.writeFile(path.join(__dirname, 'links.txt'), '', (error) => {
    if(error)
        console.log('Error while creating file: ' + error.message);
});
