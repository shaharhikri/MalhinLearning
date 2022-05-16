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

    const salt2 = await bcrypt.genSalt();
    const hashedPassword2 = await bcrypt.hash('123456', salt2);
    const newUser2 = new User(
        '456',
        'Omer Ratsaby',
        'omerrath@gmail.com',
        salt2,
        hashedPassword2.substring(29),
    );
    storeUser(newUser2);
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
    return users.find(u => u.email === email.toLowerCase())
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
        if(fs.existsSync(attachment_fileName)){
            return fs.createReadStream(attachment_fileName);
        }
        return null
    }
    catch(e){
        return null;
    }
}

async function deleteAttachment(id, attachmentName){ 
    try{
        let idsuffix = id.split("/")[1];    // id=users/1234  idsuffix=1234
        user_attachments_dir = path.join(dbMockupAttachmentsStorage, idsuffix);
        let attachment_fileName = path.join(user_attachments_dir, attachmentName);

        try {
            fs.accessSync(attachment_fileName);
            fs.unlink(attachment_fileName);
            return true;
        } catch (err) {
            return false;
        }
    }
    catch(e){
        return false;
    }
}

module.exports.storeUser = storeUser;
module.exports.findUserById = findUserById;
module.exports.findUserByEmail = findUserByEmail;
module.exports.storeAttachment = storeAttachment;
module.exports.getAttachmentsInfo = getAttachmentsInfo;
module.exports.getAttachment = getAttachment;
module.exports.deleteAttachment = deleteAttachment;