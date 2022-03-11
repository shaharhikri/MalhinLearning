const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const bodyParser = require('body-parser')
const uploadPath = require(path.join(__dirname, '../services/uploadsPathService'));
fs.ensureDir(uploadPath); // Make sure that he upload path exits
const { tokenActionAuthorizationMiddleware } = require(path.join(__dirname, '../services/userActionAuthorization'));

const router = express.Router();
router.use(bodyParser.json())

router.post("/", tokenActionAuthorizationMiddleware, (req, res) => {
    try{
        let id = req.body.id
        let idsuffix = id.split("/")[1];
        let myPath = path.join(uploadPath,idsuffix);

        if(!fs.existsSync(myPath))
            res.json([]);
        else{
            fs.readdir(myPath, (err, result)=>{
                if(err){
                    res.json({status: 'Error in read files from user(id) dir.'});
                }
                res.json(result);
            });
        }
    }
    catch {
        res.status(500).send();
    }
});

module.exports = router;