const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs-extra');
const path = require('path');
const documentStore = require(path.join(__dirname, './documentStore'));
const { User } = require('./modelClasses');

function storeUser(userEntity){
    try{
        let session = documentStore.openSession();
        session.store(userEntity, 'Users/'+userEntity.id);
        session.saveChanges();
    }
    catch (e){
        console.log('common::storeUser - RavenException');
    }

}

async function findUserById(id){
    try{
        let session = documentStore.openSession();
        let user = await session.session.load(id); 
        return user;
    }
    catch (e){
        console.log('common::findUserById - RavenException');
        return null;
    }
}

async function findUserByEmail(email){
    try{
        let session = documentStore.openSession();
        let users = await session.query(User).whereEquals('email', email).all(); 
        return users[0];
    }
    catch (e){
        console.log('common::findUserByEmail - RavenException');
        return null;
    }
}

async function storeAttachment(id, fileName, attachmentName){
    try{
        let session = documentStore.openSession();
        const file = fs.createReadStream(fileName);
        session.advanced.attachments.store(id, attachmentName, file, "text/plain");
        await session.saveChanges();
        return true;
    }
    catch (e){
        console.log('common::storeAttachment - RavenException');
        return false;
    }
}

async function getAttachmentsInfo(id){
    try{
        let session = documentStore.openSession();
        let user = await session.session.load(id)
        const names = await session.advanced.attachments.getNames(user);
        return names;
    }
    catch (e){
        console.log('common::getAttachmentsNames - RavenException', e);
        return [];
    }
}

async function getAttachment(id, filename){
    try{
        let session = documentStore.openSession();
        // let user = await session.session.load(id);
        const attachmentStream = await session.advanced.attachments.get(id, filename);
        return attachmentStream.data;
    }
    catch (e){
        console.log('common::attachmentStream - RavenException', e);
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
    module.exports.storeAttachment = storeAttachment;
    module.exports.getAttachmentsInfo = getAttachmentsInfo;
    module.exports.getAttachment = getAttachment;
}
