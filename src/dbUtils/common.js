const path = require('path');
const documentStore = require(path.join(__dirname, './documentStore'));
const { User } = require('../dbUtils/modelClasses');

function storeUser(userEntity){
    session = documentStore.openSession();
    session.store(userEntity, 'Users/'+userEntity.id);
    session.saveChanges();
}

async function findUserById(id){
    session = documentStore.openSession();
    var user = await session.session.load(id); 
    return user;
}

async function findUserByEmail(email){
    session = documentStore.openSession();
    var users = await session.query(User).whereEquals('email', email).all(); 
    return users[0];
}

module.exports.storeUser = storeUser;
module.exports.findUserById = findUserById;
module.exports.findUserByEmail = findUserByEmail;