const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const uploadFile = require(path.join(__dirname, '../services/fileService'));

const fileType = process.env.ALLOWED_TYPE;
const uploadPath = require(path.join(__dirname, '../services/uploadsPathService'));
fs.ensureDir(uploadPath); // Make sure that he upload path exits

const router = express.Router();

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.post("/", jsonParser, (req, res, next) => {
    console.log('getFilenames')
    let id = req.body.id

    let myPath = path.join(uploadPath,id);
    console.log('PATH '+myPath)
    
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