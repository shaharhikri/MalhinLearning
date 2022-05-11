const supertest = require("supertest");
const should = require("should");
const server = supertest.agent("http://localhost:8080");
const path = require('path');
const fs = require('fs');
const expect = require('chai').expect;
const assert = require('chai').assert;
const jwt = require('jsonwebtoken');
const userPath = path.join(__dirname, '../uploads/123/');



let secret = "350acf30b4ad99a7d609e61d247027ff754e686532427d5ac6498f933a92305f74e5109a15693ad87e1544e97d70aea858c79d0d3722cc92ac7c29143f0a8a95";

describe('Access user attachments (output files)', function() {

    it('should return status code 200', async function() {
        let token1 = "";
        let userId ="";
        //Test - login with with valid user+pass, get the user's outp file list.
        await server
            .post("/login")
            .send({email: 'shaharhikri@gmail.com', password: '123456' })
            .expect((res) =>{
                let tokenObj = res.body;
                jwt.verify(tokenObj.token, secret,(err, decriptedToken) => {
                    userId = decriptedToken;
                });
            token1 = tokenObj.token;
            });

        assert.notEqual(token1,"");    
        await server
        .post("/melodies/getattachmentsnames")
        .set('Content-Type','application/json')
        .set('Cookie',"{\"token\":\""+token1+"\"}")
        .send({id: userId})
        .expect(200);
      
    });

});



describe('Access user attachments (output files)', async function() {
    let attUserPath = "../mockupFiles/dbMockupAttachmentsStorage/123/"
    if(!fs.existsSync(attUserPath))
        fs.mkdirSync(attUserPath);
    else{
        let files = fs.readdirSync(attUserPath);
        files.forEach((file,index) => {
            var curPath = attUserPath + "/" + file;
            fs.unlinkSync(curPath);
        });
    }

    fileList = []
    for (let i = 0; i < 3; i++) {
        await fs.copyFile(`${__dirname}/test_files/${i}.midi`,`../mockupFiles/dbMockupAttachmentsStorage/123/${i}.midi`, (err) =>{
            if(err) throw err;
        });
        fileList.push(`${i}.midi`)
    }
    
    it('should return the output files list', async function() {
        let token1 = "";
        let userId ="";
        //Test - login with with valid user+pass, get the user's outp file list.
        await server
            .post("/login")
            .send({email: 'shaharhikri@gmail.com', password: '123456' })
            .expect((res) =>{
                let tokenObj = res.body;
                jwt.verify(tokenObj.token, secret,(err, decriptedToken) => {
                    userId = decriptedToken;
                });
            token1 = tokenObj.token;
            });

        assert.notEqual(token1,"");    
        await server
        .post("/melodies/getattachmentsnames")
        .set('Content-Type','application/json')
        .set('Cookie',"{\"token\":\""+token1+"\"}")
        .send({id: userId})
        .expect((res) =>{
            expect(res.body).to.eql(fileList)
         })
        .expect(200);
      
        for (let i = 0; i < 3; i++) {
            fs.unlinkSync(attUserPath+`${i}.midi`);
        }
    });

});


describe('Access user attachments (output files) with the wrong token', function() {
    
    it('should return 401 status code & propper message sin', async function() {
        let userId ="Users/123";
        let badToken = "KSJNDSKLDFNS131";

            await server
            .post("/melodies/getattachmentsnames")
            .set('Content-Type','application/json')
            .set('Cookie',"{\"token\":\""+badToken+"\"}")
            .send({id: userId})
            .expect(401);
      
    });

});



describe('Access user attachments (output files) with the wrong id', function() {

    it('should return 401 status code & propper message', async function() {
        let token1 = "";
        let badUserId ="123";
       
        await server
            .post("/login")
            .send({email: 'omerrath@gmail.com', password: '123456' })
            .expect((res) =>{
                let tokenObj = res.body;
                jwt.verify(tokenObj.token, secret,(err, decriptedToken) => {
                    userId = decriptedToken;
                });
                token1 = tokenObj.token;

            });
            assert.notEqual(token1,"");
            await server
            .post("/melodies/getattachmentsnames")
            .set('Content-Type','application/json')
            .set('Cookie',"{\"token\":\""+token1+"\"}")
            .send({id: badUserId})
            .expect(401);
    });

});


describe('Delete user attachments (output files)', async function() {
   
    await fs.copyFile(`${__dirname}/test_files/output.midi`,`../mockupFiles/dbMockupAttachmentsStorage/123/output.midi`, (err) =>{
        if(err) throw err;
    });

    it('should return status code 200 since the requested file removed successfuly', async function() {
        let token1 = "";
        let userId ="";
        //Test - login with with valid user+pass, get the user's outp file list.
        await server
            .post("/login")
            .send({email: 'shaharhikri@gmail.com', password: '123456' })
            .expect((res) =>{
                let tokenObj = res.body;
                jwt.verify(tokenObj.token, secret,(err, decriptedToken) => {
                    userId = decriptedToken;
                });
            token1 = tokenObj.token;
            });

        assert.notEqual(token1,"");    
        await server
        .delete("/melodies//delete/output.midi")
        .set('Content-Type','application/json')
        .set('Cookie',"{\"token\":\""+token1+"\"}")
        .send({id: userId})
        .expect(200);
      
    });

});


describe('Delete user attachments (output files)', function() {
   
    it('should return status code 404 since the requested file is not found', async function() {
        let token1 = "";
        let userId ="";
        //Test - login with with valid user+pass, get the user's outp file list.
        await server
            .post("/login")
            .send({email: 'shaharhikri@gmail.com', password: '123456' })
            .expect((res) =>{
                let tokenObj = res.body;
                jwt.verify(tokenObj.token, secret,(err, decriptedToken) => {
                    userId = decriptedToken;
                });
            token1 = tokenObj.token;
            });

        assert.notEqual(token1,"");    
        await server
        .delete("/melodies//delete/notFound.midi")
        .set('Content-Type','application/json')
        .set('Cookie',"{\"token\":\""+token1+"\"}")
        .send({id: userId})
        .expect(404);
      
    });

});