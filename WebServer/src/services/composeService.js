const dotenv = require('dotenv');
dotenv.config();
const letscompose_url = process.env.COMPOSE_SERVICE_URL;
const axios = require("axios");
const fs = require('fs-extra');
const path = require('path');
const mockupFilesPath = require(path.join(__dirname, '../services/mockupFilesPath'));

async function letscompose(inputfile, outputfile, genre ) {
    data = {
        inputfile : inputfile,
        outputfile : outputfile, 
        genre : genre
    };

    const headers = {
        'Content-Type': 'application/json',
    }
    try{
        let res = await axios.post(letscompose_url, data, {
            headers: headers
        });
        
        return {
            succeeded : res.status==200, 
            resStatus : res.status, 
            resMsg : res.data
        };
    }    
    catch(e){
        return {
            succeeded : false, 
            resStatus : e.response.status, 
            resMsg : e.response.data
        };
    }  
}

async function letscompose_mockup(inputfile, outputfile, genre ){
    let output_stub_file = path.join(mockupFilesPath, 'output_stub.mid');
    fs.copyFileSync(output_stub_file, outputfile);
    return {
        succeeded : true, 
        resStatus : 200, 
        resMsg : { outputfile : outputfile }
    };
}


if (process.env.COMPOSE_SERVICE_MOCKUP === 'TRUE'){
    module.exports = letscompose_mockup;
}
else{
    module.exports = letscompose;
}