const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const busboy = require('connect-busboy'); // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');
const fs = require('fs-extra');
const uploadFile = require(path.join(__dirname, '../services/fileService'));

const fileType = process.env.ALLOWED_TYPE;
const uploadPath = require(path.join(__dirname, '../services/uploadsPathService'));
fs.ensureDir(uploadPath); // Make sure that he upload path exits

const router = express.Router();


router.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware

router.post("/Users/:idsuffix", (req, res, next) => {
    if (req === undefined)
        return;

    let idsuffix = req.params.idsuffix
    let myPath = path.join(uploadPath,idsuffix);
    if(!fs.existsSync(myPath))
        fs.mkdirSync(myPath);

    req.pipe(req.busboy); // Pipe it trough busboy

    req.busboy.on('file', (fieldname, file, filename, x,  mimeType) => {
        uploadFile(file, filename, mimeType,fileType, myPath);
    });
    res.redirect('back');

});

module.exports = router;