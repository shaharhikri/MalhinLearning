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

router.post("/", (req, res) => {
    //TODO: add token veification
    if (req === undefined)
        return;

    req.pipe(req.busboy); // Pipe it trough busboy
    
    req.busboy.on('field', function(key, value){
        try{
            let idsuffix = value.split("/")[1];
            console.log('pttt',value,idsuffix)
            let myPath = path.join(uploadPath,idsuffix);
            console.log(myPath)
            if(!fs.existsSync(myPath))
                fs.mkdirSync(myPath);
        
            req.busboy.on('file', (fieldname, file, filename, x,  mimeType) => {
                uploadFile(file, filename, mimeType,fileType, myPath);
            });
        }
        catch{
            console.log('ERR_INVALID_ARG_TYPE')
        }
    });
    
    res.redirect('back');
    // TODO: Fix redirect('back') doesnt refresh the page in the end of the req.
});

module.exports = router;