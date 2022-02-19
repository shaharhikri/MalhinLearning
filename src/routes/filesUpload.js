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

/**
 * Create route /upload which handles the post request
 */
router.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware

router.post("/", (req, res, next) => {
    if (req === undefined)
        return;

    //get id from cookies, and if isnwt exists - make dir.
    let cookie = JSON.parse(req.headers.cookie);
    let id = cookie.id;
    let myPath = path.join(uploadPath,id);
    
    if(!fs.existsSync(myPath))
        fs.mkdirSync(myPath);

    req.pipe(req.busboy); // Pipe it trough busboy

    req.busboy.on('file', (fieldname, file, filename, x,  mimeType) => {
        uploadFile(file, filename, mimeType,fileType, myPath);
    });

    res.redirect('back');

});


router.get("/getFilenames", (req, res, next) => {
    let cookie = JSON.parse(req.headers.cookie);
    let id = cookie.id;
    let myPath = path.join(uploadPath,id);
    
    if(!fs.existsSync(myPath))
        res.json({});
    else{
        fs.readdir(myPath, (err, result)=>{
            if(err){
                res.json({status: 'Error in read files from user(id) dir.'});
            }
            res.json(result);
        });
    }
});

module.exports = router;