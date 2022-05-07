const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const busboy = require('connect-busboy'); // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');
const fs = require('fs-extra');
const { endianness } = require('os');
const uploadFile = require(path.join(__dirname, '../services/fileService'));

const fileType = process.env.ALLOWED_TYPE;
const uploadPath = require(path.join(__dirname, '../services/uploadsPathService'));
fs.ensureDir(uploadPath); // Make sure that he upload path exits
const { vaildateToken } = require(path.join(__dirname, '../services/userActionAuthorization'));
const parseToken = require(path.join(__dirname, '../services/tokenParser'));
const router = express.Router();
router.use(busboy({ highWaterMark: 2 * 1024 * 1024, })); // Set 2MiB buffer

router.post("/", async (req, res, next) => {
    try{
        if (!req || !req.busboy){
            res.status(400).send();
            return;
        }
        
        const token = parseToken(req);
        if(!token){
            res.status(401).json({ error : 'You are not authorized to perform this action.' });
            return;
        }
        req.pipe(req.busboy); // Pipe it trough busboy
        req.busboy.on('finish', function() {
            next();
        });  
        req.busboy.on('field', function(key, value){
            try{
                let id = value;
                const ifAuthorized = () => {
                    let idsuffix = id.split("/")[1];
                    let myPath = path.join(uploadPath,idsuffix);
                
                    req.busboy.on('file', (fieldname, file, filename, x,  mimeType) => {
                        let uploadFile_res = uploadFile(file, filename, mimeType,fileType, myPath);
                        if ( uploadFile_res && uploadFile_res.succeeded)
                            res.status(200).send();
                        else
                            res.status(400).json({ error : uploadFile_res.msg});
                    });
                };
                const ifForbidden = () => {  
                    res.status(401).json({ error : 'You are not authorized to perform this action.' });
                };
                vaildateToken(token, id, ifAuthorized, ifForbidden);
            }
            catch{
                res.status(500).json({ error : "ERR_INVALID_ARG_TYPE"}); 
            }
        });
    }
    catch {
        res.status(500).json({ error : "Internal Server Error"}); 
    }
}, (req, res) => {
    
});

module.exports = router;