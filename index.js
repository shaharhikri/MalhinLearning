const dotenv = require('dotenv');
dotenv.config();
const express = require('express'); // Express Web Server
const port = process.env.PORT

const app = express(); // Initialize the express web server
const filesUploadRouter = require('./src/routes/filesUpload');
const composeRouter = require('./src/routes/compose');
const userAuth = require('./src/routes/userAuth')[0];
const checkAuthenticated = require('./src/routes/userAuth')[1];
const showFilesRouter = require('./src/routes/showFiles');
app.set('view-engine', 'ejs')
app.use('/upload', filesUploadRouter);
app.use('/compose', composeRouter);
app.use('/getFilenames', showFilesRouter);
app.use(userAuth);

/**
 * Serve the basic index.ejs with upload form
 */
app.get("/", checkAuthenticated, (req, res) => {
    res.render(__dirname + '/src/static/index.ejs' , { name: req.user.name, userid: req.user.id });
});

app.get("/script", (req, res) => {
    res.sendFile(__dirname + '/src/static/scripts/index_script.js');
});

const server = app.listen(port, function () {
    console.log(`Listening on port ${server.address().port}`);
});

// const ravendb = require('./src/dbUtils/common');
// async function a(){
//     var user = await ravendb.findUserById('Users/78940003cd027b4c0485ee1e9b953421')
//     console.log('USERRRR ',user)    
//     var user2 = await ravendb.findUserById('Users/78940003cd027b4c0485ee1e9b953422')
//     console.log('USERRRR2 ',user2) 
// }
// a();
