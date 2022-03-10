const path = require('path');
const documentStore = require(path.join(__dirname, './documentStore'));
const { User } = require('./modelClasses');

function storeUser(userEntity){
    try{
        session = documentStore.openSession();
        session.store(userEntity, 'Users/'+userEntity.id);
        session.saveChanges();
    }
    catch (e){
        console.log('common::storeUser - RavenException');
    }

}

async function findUserById(id){
    try{
        session = documentStore.openSession();
        var user = await session.session.load(id); 
        return user;
    }
    catch (e){
        console.log('common::findUserById - RavenException');
        return null;
    }
}

async function findUserByEmail(email){
    try{
        session = documentStore.openSession();
        var users = await session.query(User).whereEquals('email', email).all(); 
        return users[0];
    }
    catch (e){
        console.log('common::findUserByEmail - RavenException');
        return null;
    }
}

if (process.env.RUNMODE === 'TEST'){
    module.exports = require('./commonMockup');
}
else{
    module.exports.storeUser = storeUser;
    module.exports.findUserById = findUserById;
    module.exports.findUserByEmail = findUserByEmail;
}
