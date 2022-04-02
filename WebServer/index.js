const dotenv = require('dotenv');
dotenv.config();
const express = require('express'); // Express Web Server
const port = process.env.PORT;

const app = express(); // Initialize the express web server
const filesUploadRouter = require('./src/routes/filesUpload');
const composeRouter = require('./src/routes/compose');
const userSignRouter = require('./src/routes/userSign');
const showFilesRouter = require('./src/routes/showFiles');
const staticRouter = require('./src/routes/static');
const melodiesRouter = require('./src/routes/melodies');
const { tokenConnectedAuthenticationMiddleware } = require('./src/services/userSignAuthentication');
app.set('view engine', 'ejs');
app.use('/upload', filesUploadRouter);
app.use('/compose', composeRouter);
app.use('/getFilenames', showFilesRouter);
app.use('/static', staticRouter);
app.use(userSignRouter);
app.use('/melodies',melodiesRouter);


/**
 * Serve the basic index.ejs with upload form
 */
app.get("/", tokenConnectedAuthenticationMiddleware, (req, res) => {
    res.render('index' , { name: req.user.name, userid: req.user.id });
});

const server = app.listen(port, function () {
    console.log(`Listening on port ${server.address().port}`);
});


// //------------------raven attachments test----------------from index.js 12.3
let ravendb = require('./src/dbUtils/common');
// const { Console } = require('console');

// async function uploadFileAsAtt(id,fileName,attachmentName){
//     ravendb.storeAttachment(id,fileName,attachmentName);
//     console.log('***storeAttachment:',attachmentName);
// }

async function showAttInfo(id){
    console.log('***showAttInfo:',await ravendb.getAttachmentsInfo(id));
    
}

async function getAttStream(id,attachmentName){
    let s = await ravendb.getAttachment(id,attachmentName);
}