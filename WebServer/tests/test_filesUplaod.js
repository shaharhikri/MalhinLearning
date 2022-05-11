const supertest = require("supertest");
const should = require("should");
const server = supertest.agent("http://localhost:8080");
const path = require('path');
const fs = require('fs');
const expect = require('chai').expect;
const assert = require('chai').assert;
const jwt = require('jsonwebtoken');


let secret = "350acf30b4ad99a7d609e61d247027ff754e686532427d5ac6498f933a92305f74e5109a15693ad87e1544e97d70aea858c79d0d3722cc92ac7c29143f0a8a95";




describe('Upload an input file', function() {

    it('should return status code 200 since the user is authorized to upload files to its own folder', async function() {
        let token1 = "";
        let userId ="";
        //Test - login with with valid user+pass
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
        .post("/upload")
        .set('Content-Type','multipart/form-data')
        .set('Cookie',"{\"token\":\""+token1+"\"}")
        .field('field','Users/123')
        .attach('file',  `${__dirname}/test_files/input_file.krn`)
        .expect(200);
      
    });

});


describe('Upload an input file', function() {

    it('should return status code 401 and proper message since the userId does not not match', async function() {
        let token1 = "";
        let badUserId ="456";
        //Test - login with with valid user+pass
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
        .post("/upload")
        .set('Content-Type','multipart/form-data')
        .set('Cookie',"{\"token\":\""+token1+"\"}")
        .field('field','Users/'+badUserId)
        .attach('file',  `${__dirname}/test_files/input_file.krn`)
        .expect(401);
      
    });

});

describe('Upload an input file', function() {

    it('should return status code 401 and proper message since the token does not match ', async function() {
        let userId ="";
        let badToken = "KSJNDSKLDFNS131";
        //Test - login with with valid user+pass
        
        await server
        .post("/upload")
        .set('Content-Type','multipart/form-data')
        .set('Cookie',"{\"token\":\""+badToken+"\"}")
        .field('field','Users/'+userId)
        .attach('file',  `${__dirname}/test_files/input_file.krn`)
        .expect(401);
      
    });

});
