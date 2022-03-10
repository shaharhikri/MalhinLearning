const bcrypt = require('bcrypt');
const genUUID = require('../services/uuidFactory');
const { User } = require('../dbUtils/modelClasses');

const users = []
async function addStubUser(){
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('123456', salt);
    const newUser = new User(
        '123',
        'Shahar Hikri',
        'shaharhikri@gmail.com',
        salt,
        hashedPassword.substring(29),
    );
    storeUser(newUser);
}
addStubUser();

//-------Function to export:--------

function storeUser(userEntity){
    userEntity.id = 'Users/'+userEntity.id;
    users.push(userEntity);
}

async function findUserById(id){
    return users.find(u => u.id === id)
}

async function findUserByEmail(email){
    return users.find(u => u.email === email)
}

module.exports.storeUser = storeUser;
module.exports.findUserById = findUserById;
module.exports.findUserByEmail = findUserByEmail;