const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const uploadPath = require(path.join(__dirname, '../services/uploadsPathService'));
const programPath = process.env.SCRIPT_PATH
const fs = require('fs-extra');

const router = express.Router();

router.post("/getUserSeed", (req, res) => {
    let cookie = JSON.parse(req.headers.cookie);
    let id = cookie.id;
    let myPath = path.join(uploadPath, id);
    if (!fs.existsSync(myPath))
        res.json({});
    else {
        fs.readdir(myPath, (err, result) => {
            if (err) {
                res.json({ status: 'Error in read files from user(id) dir.' });
            }
            var dataToSend;
            console.log('getUserSeed: filename: '+path.join(myPath, result[0]+'')+'\n'+programPath)

            // spawn new child process to call the python script
            const python = spawn('python', [programPath, path.join(myPath, result[0]+'')+' '+myPath]);
            // collect data from script
            python.stdout.on('data', function (data) {
                console.log('Pipe data from python script ...');
                dataToSend = data.toString();
            });
        
            python.on('close', (code) => {
                console.log(`child process close all stdio with code ${code}`);
                // send data to browser
                res.redirect('/')
            });
        });
    }

})

module.exports = router;