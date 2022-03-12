const uuidGen = require('crypto');
const path = require('path');
let ravendb = require(path.join(__dirname, '../dbUtils/common'));

async function genUuid(){
    let uuid = uuidGen.randomBytes(16).toString('hex');

    let user = await ravendb.findUserById('Users/'+uuid);
    while(user!=null){
        uuid = uuidGen.randomBytes(16).toString('hex');
        user = await ravendb.findUserById('Users/'+uuid);
    }

    return uuid;
}

module.exports = genUuid;