import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import indexRoutes from './routes/index.js';
import apiRoutes from './routes/api.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/', indexRoutes);
app.use('/api', apiRoutes);

start();

function start() {
    try {
        app.listen(PORT, () => {
            console.log(`Successful server startup on port ${PORT}`)
        });
    }
    catch (err) {
        console.log(err);
    }
}
