const users = []

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