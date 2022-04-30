const bcrypt = require('bcrypt');
const { User } = require('../dbUtils/modelClasses');
const fs = require('fs-extra');
const path = require('path');
const dbMockupAttachmentsStorage = path.join(require(path.join(__dirname, '../services/mockupFilesPath')), 'dbMockupAttachmentsStorage');
if(!fs.existsSync(dbMockupAttachmentsStorage)){
    fs.mkdirSync(dbMockupAttachmentsStorage);
}

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

// attachments funcs
async function storeAttachment(id, fileName, attachmentName){
    try{
        let idsuffix = id.split("/")[1];    // id=users/1234  idsuffix=1234
        user_attachments_dir = path.join(dbMockupAttachmentsStorage, idsuffix);
        if(!fs.existsSync(user_attachments_dir))
            fs.mkdirSync(user_attachments_dir);
        let attachment_fileName = path.join(user_attachments_dir, attachmentName);
        fs.copyFileSync(fileName, attachment_fileName);
        return true;
    }
    catch(e){
        return false;
    }
}

async function getAttachmentsInfo(id){ 
    try{
        let idsuffix = id.split("/")[1];    // id=users/1234  idsuffix=1234
        user_attachments_dir = path.join(dbMockupAttachmentsStorage, idsuffix);
        
        let attList = [];
        if(fs.existsSync(user_attachments_dir)){
            fileList = fs.readdirSync(user_attachments_dir);
            fileList.forEach( e => attList.push({ name:e }) );
        }
        return attList;
    }
    catch(e){
        return [];
    }
}

async function getAttachment(id, attachmentName){ 
    try{
        let idsuffix = id.split("/")[1];    // id=users/1234  idsuffix=1234
        user_attachments_dir = path.join(dbMockupAttachmentsStorage, idsuffix);
        let attachment_fileName = path.join(user_attachments_dir, attachmentName);
    
        return fs.createReadStream(attachment_fileName);
    }
    catch(e){
        return null;
    }
}

module.exports.storeUser = storeUser;
module.exports.findUserById = findUserById;
module.exports.findUserByEmail = findUserByEmail;
module.exports.storeAttachment = storeAttachment;
module.exports.getAttachmentsInfo = getAttachmentsInfo;
module.exports.getAttachment = getAttachment;