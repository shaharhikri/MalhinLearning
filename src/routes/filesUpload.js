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
const { vaildateToken } = require(path.join(__dirname, '../services/userActionAuthorization'));
const parseToken = require(path.join(__dirname, '../services/tokenParser'));

const router = express.Router();

router.use(busboy({ highWaterMark: 2 * 1024 * 1024, })); // Set 2MiB buffer

router.post("/", (req, res, next) => {
    if (req === undefined)
        return;

    const token = parseToken(req);
    console.log('fileUpload token',token);

    req.pipe(req.busboy); // Pipe it trough busboy
    
    req.busboy.on('field', function(key, value){
        try{
            let id = value;
            const ifAuthorized = () => {
                let idsuffix = id.split("/")[1];
                let myPath = path.join(uploadPath,idsuffix);
                console.log(myPath)
                if(!fs.existsSync(myPath))
                    fs.mkdirSync(myPath);
            
                req.busboy.on('file', (fieldname, file, filename, x,  mimeType) => {
                    uploadFile(file, filename, mimeType,fileType, myPath);
                    res.status(200).send();;
                });
            }
            const ifForbidden = () => {                 
                next();
            };

            vaildateToken(token, id, ifAuthorized, ifForbidden);
        }
        catch{
            console.log('ERR_INVALID_ARG_TYPE')
        }
    });
    req.busboy.on('finish', function() {
        next();
    });
    
}, (req, res) => {
    console.log('fileUpload ifForbidden');
    res.status(403).send();
});

module.exports = router;