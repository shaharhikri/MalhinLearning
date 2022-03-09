const uuidGen = require('crypto');
const fs = require('fs-extra');
const path = require('path');
let ravendb = require(path.join(__dirname, '../dbUtils/common'));
if (process.env.RUNMODE === 'TEST'){
    ravendb = require(path.join(__dirname, '../dbUtils/commonMockup'));
}
const { User } = require('../dbUtils/modelClasses');

async function genUuid(uploadPath){
    let uuid = uuidGen.randomBytes(16).toString('hex');
    let p = path.join(uploadPath,uuid);

    let user = await ravendb.findUserById('Users/'+uuid);
    while(user!=null){
        uuid = uuidGen.randomBytes(16).toString('hex');
        user = await ravendb.findUserById('Users/'+uuid);
    }

    return uuid;
}

module.exports = genUuid;