const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const uploadPath = require(path.join(__dirname, '../services/uploadsPathService'));
const fs = require('fs-extra');
const bodyParser = require('body-parser')
const { tokenActionAuthorizationMiddleware } = require(path.join(__dirname, '../services/userActionAuthorization'));
const { letscompose, getgenres} = require(path.join(__dirname, '../services/composeService'));
const ravendb = require(path.join(__dirname, '../dbUtils/common'));
const default_genre = 'waltzes';


const router = express.Router();
router.use(bodyParser.json());

router.post("/", tokenActionAuthorizationMiddleware, async (req, res) => {
    try {
        let id = req.body.id                //users/1234
        let idsuffix = id.split("/")[1];    //      1234

        let myPath = path.join(uploadPath, idsuffix); // Current user upload folder
        //console.log(myPath)
        if (!fs.existsSync(myPath))
            res.json({});
        else {
            fs.readdir(myPath, async (err, result) => {
                let inputfile, outputfile, outputfile_name, genre;
                genre = req.body.genre;
                if (!genre)
                    genre = default_genre
                if (result && result.length > 0) {
                    inputfile_name = result[0] + '';
                    inputfile = path.join(myPath, inputfile_name);
                    outputfile_suffix = getOutputfileSuffix(genre);
                    outputfile_name = inputfile_name.split('.')[0] + outputfile_suffix + '.midi'
                    outputfile = path.join(myPath, outputfile_name);
                }
                if (inputfile && outputfile && genre) {
                    let letscompose_result = await letscompose(inputfile, outputfile, genre);

                    let createAndStoreMelody_succeeded = letscompose_result.succeeded;

                    if (letscompose_result.succeeded) {
                        createAndStoreMelody_succeeded = await ravendb.storeAttachment(id, outputfile, outputfile_name);
                    }
                    fs.exists(outputfile, function (exists) {
                        if (exists) {
                            fs.unlink(outputfile);
                        }
                    }); // Remove output file anyway (even if the attachment storing didn't succeeded)

                    if(createAndStoreMelody_succeeded){
                        let outputFilePath = letscompose_result.resMsg.outputfile;
                        let outputFilePath_arr = outputFilePath.split("\\");
                        let outputFileName = outputFilePath_arr[outputFilePath_arr.length - 1];
                        res.status(letscompose_result.resStatus).json({ melody : outputFileName });
                    }
                    else{
                        res.status(500).json('Something went wrong with creating or storing your new melody.');
                    }
                }
                else {
                    res.status(400).json({ error: 'No given file to compose.' });
                }
            });
        }
    }
    catch {
        res.status(500).send();
    }
})

router.get("/getgenres", async (req, res) => {
    try {
        let getgenres_result = await getgenres();
        res.status(getgenres_result.resStatus).json(getgenres_result.resMsg);
    }
    catch(e){
        // console.log(e)
        res.status(500).send();
    }
})


function getOutputfileSuffix(genre) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    let ms = today.getMilliseconds();

    let suffix = '_' + genre + '_' + dd + '-' + mm + '-' + yyyy + '_' + h + '-' + m + '-' + s + '-' + ms;
    return suffix;
}


module.exports = router;