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

describe('Compose a melody', function() {

    it('should return status code 200 & propper message', async function() {
        let token1 = "";
        let userId ="";
        // copy file from test_files dir into uploads/userId dir 
        fs.copyFile(`${__dirname}/test_files/input_file.krn`,"../uploads/123/input_file.krn", (err) =>{
            if(err) throw err;
        });

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
        .post("/compose")
        .set('Content-Type','application/json')
        .set('Cookie',"{\"token\":\""+token1+"\"}")
        .send({id:userId})
        .expect(200);

        fs.unlinkSync(userPath+"input_file.krn");
    });
   
});


describe('Compose a melody', function() {

    it('should return status code 400 & propper message since no file has been uploaded', async function() {
        let token1 = "";
        let userId ="";
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
        .post("/compose")
        .set('Content-Type','application/json')
        .set('Cookie',"{\"token\":\""+token1+"\"}")
        .send({id:userId})
        .expect(400);
        
    });
   
});


describe('Compose a melody', function() {

    it('should return status code 401 & propper message since since the auth token does not match', async function() {
        let badToken = "KSJNDSKLDFNS131";
        let userId ="";
        // copy file from test_files dir into uploads/userId dir 
        fs.copyFile(`${__dirname}/test_files/input_file.krn`,"../uploads/123/input_file.krn", (err) =>{
            if(err) throw err;
        });
        await server
        .post("/compose")
        .set('Content-Type','application/json')
        .set('Cookie',"{\"token\":\""+badToken+"\"}")
        .send({id:userId})
        .expect(401);

        fs.unlinkSync(userPath+"input_file.krn");
    });
   
});



describe('Compose a melody', function() {

    it('should return status code 401 & propper message since since the the user id does not match', async function() {
        let token1 = "";
        let badUserId ="456";
        // copy file from test_files dir into uploads/userId dir 
        fs.copyFile(`${__dirname}/test_files/input_file.krn`,"../uploads/123/input_file.krn", (err) =>{
            if(err) throw err;
        });
        await server
            .post("/login")
            .send({email: 'shaharhikri@gmail.com', password: '123456' })
            .expect((res) =>{
                let tokenObj = res.body;
                jwt.verify(tokenObj.token, secret,(err, decriptedToken) => {
                });
            token1 = tokenObj.token;
            });

        assert.notEqual(token1,"");    
        await server
        .post("/compose")
        .set('Content-Type','application/json')
        .set('Cookie',"{\"token\":\""+token1+"\"}")
        .send({id:badUserId})
        .expect(401);

        fs.unlinkSync(userPath+"input_file.krn");
    });
   
});