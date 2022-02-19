const uuidGen = require('crypto');
const fs = require('fs-extra');
const path = require('path');

function genUuid(uploadPath){
    let uuid = uuidGen.randomBytes(16).toString('hex');
    let p = path.join(uploadPath,uuid); //uploadPath+'/'+uuid+'/'
    while(fs.existsSync(p)){
        uuid = uuidGen.randomBytes(16).toString('hex');
    }
    return uuid;
}

module.exports = genUuid;