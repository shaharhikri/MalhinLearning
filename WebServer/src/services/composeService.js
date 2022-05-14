const dotenv = require('dotenv');
dotenv.config();
const letscompose_url = process.env.COMPOSE_SERVICE_BASE_URL+process.env.COMPOSE_SERVICE_LETSCOMPOSE_COMMAND;
const getgenres_url = process.env.COMPOSE_SERVICE_BASE_URL+process.env.COMPOSE_SERVICE_GETGENRES_COMMAND;
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
            resStatus : e.response?e.response.status:500, 
            resMsg : e.response?.data
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

async function getgenres() {
    const headers = {
        'Content-Type': 'application/json',
    }
    try{
        let res = await axios.get(getgenres_url, {}, {
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
            resStatus : e.response?e.response.status:500, 
            resMsg : e.response?.data
        };
    }  
}

async function getgenres_mockup() {
    return {
        succeeded : true, 
        resStatus : 200, 
        resMsg : { genres : ['mockup_genre'] }
    };
}


if (process.env.COMPOSE_SERVICE_MOCKUP === 'TRUE'|| process.env.TEST_MODE === 'TRUE'){
    module.exports = { letscompose: letscompose_mockup, getgenres: getgenres_mockup};
}
else{
    module.exports = { letscompose: letscompose, getgenres: getgenres};
}

// async function f(){
//     let g = await getgenres();
//     console.log('*getgenres: '+ JSON.stringify(g.resMsg));
// }

// f();
// console.log(getgenres_url)