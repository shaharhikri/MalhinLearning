const dotenv = require('dotenv');
dotenv.config();

const express = require('express'); // Express Web Server
const path = require('path');
const ravendb = require(path.join(__dirname, '../dbUtils/common'));
const { tokenActionAuthorizationMiddleware, tokenActionAuthorizationNoUserIdMiddleware } = require(path.join(__dirname, '../services/userActionAuthorization'));
const bodyParser = require('body-parser')

const router = express.Router();
router.use(bodyParser.json());


//For example: http://localhost:8080/melodies/download/input_file_waltzes_02-04-2022_19-19-27-495.midi
router.get("/download/:attName", tokenActionAuthorizationNoUserIdMiddleware, async (req, res) => {
    let stream = await ravendb.getAttachment(req.body.id, req.params.attName);
    if ( stream ){
        stream.pipe(res);
    }
    else {
        res.status(404).json( { error : 'Attachment '+req.params.attName+' didnt found for this user.'} );
    }
});

//For example: DELETE http://localhost:8080/melodies/delete/input_file_waltzes_02-04-2022_19-19-27-495.midi
router.delete("/delete/:attName", tokenActionAuthorizationMiddleware, async (req, res) => {
    if(await ravendb.deleteAttachment(req.body.id, req.params.attName)){
        res.status(200).send();
    }
    else{
        res.status(404).json( { error : 'Attachment '+req.params.attName+' didnt found for this user.'} );
    }
});


router.post("/getattachmentsnames", 
tokenActionAuthorizationMiddleware, 
async (req, res) => {
    try{
        let infoList = await ravendb.getAttachmentsInfo(req.body.id);
        if ( !infoList || !Array.isArray(infoList)) {
            res.status(404).send();
        }
        else{
            let names = []
            infoList.forEach( o => {
                if(o && o.name){
                    names.push(o.name);
                }
            })
            res.status(200).json(names);
        }
    }
    catch(e) {
        res.status(500).send();
    }
});

module.exports = router;