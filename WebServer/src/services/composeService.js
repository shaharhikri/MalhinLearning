const dotenv = require('dotenv');
dotenv.config();
const letscompose_url = process.env.COMPOSE_SERVICE_URL;
const axios = require("axios");

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


module.exports = letscompose;