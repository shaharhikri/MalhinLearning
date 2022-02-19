const dotenv = require('dotenv');
dotenv.config();
const express = require('express'); // Express Web Server
const port = process.env.PORT

const app = express(); // Initialize the express web server
const filesUploadRouter = require('./src/routes/filesUpload');
const uuidRouter = require('./src/routes/uuid');
const composeRouter = require('./src/routes/compose');
app.use('/upload', filesUploadRouter);
app.use('/cookies', uuidRouter);
app.use('/compose', composeRouter);

/**
 * Serve the basic index.html with upload form
 */
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/src/static/index.html');
});

app.get("/script", (req, res) => {
    res.sendFile(__dirname + '/src/static/scripts/index_script.js');
});

const server = app.listen(port, function () {
    console.log(`Listening on port ${server.address().port}`);
});