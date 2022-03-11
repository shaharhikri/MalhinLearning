const dotenv = require('dotenv');
dotenv.config();
const express = require('express'); // Express Web Server
const port = process.env.PORT;

const app = express(); // Initialize the express web server
const filesUploadRouter = require('./src/routes/filesUpload');
const composeRouter = require('./src/routes/compose');
const userSign = require('./src/routes/userSign');
const showFilesRouter = require('./src/routes/showFiles');
const staticRouter = require('./src/routes/static');
const { tokenConnectedAuthenticationMiddleware } = require('./src/services/userSignAuthentication');
app.set('view engine', 'ejs');
app.use('/upload', filesUploadRouter);
app.use('/compose', composeRouter);
app.use('/getFilenames', showFilesRouter);
app.use('/static', staticRouter);
app.use(userSign);


/**
 * Serve the basic index.ejs with upload form
 */
app.get("/", tokenConnectedAuthenticationMiddleware, (req, res) => {
    console.log(req.user);
    res.render('index' , { name: req.user.name, userid: req.user.id });
});

const server = app.listen(port, function () {
    console.log(`Listening on port ${server.address().port}`);
});