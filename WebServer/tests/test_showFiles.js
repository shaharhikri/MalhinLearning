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

// describe('Access user file list', function() {

//     it('should return the file list', async function() {
//         let token1 = "";
//         let userId ="";
//         //Test - login with with valid user+pass, get the user's file list.
//         await server
//             .post("/login")
//             .send({email: 'shaharhikri@gmail.com', password: '123456' })
//             .expect((res) =>{
//                 let tokenObj = res.body;
//                 jwt.verify(tokenObj.token, secret,(err, decriptedToken) => {
//                     userId = decriptedToken;
//                 });
//             token1 = tokenObj.token;
//             });

//         assert.notEqual(token1,"");    
//         await server
//         .post("/getFilenames")
//         .set('Content-Type','application/json')
//         .set('Cookie',"{\"token\":\""+token1+"\"}")
//         .send({id: userId})
//         .expect(200);
      
//     });

// });



// describe('Access user file list with the wrong token', function() {

//     it('should return 401 status code & propper message', async function() {
//         let userId ="";
//         let badToken = "KSJNDSKLDFNS131";

//             await server
//             .post("/getFilenames")
//             .set('Content-Type','application/json')
//             .set('Cookie',"{\"token\":\""+badToken+"\"}")
//             .send({id: userId})
//             .expect(401);
      
//     });

// });




// describe('Access user file list with the wrong id', function() {

//     it('should return 401 status code & propper message', async function() {
//         let token1 = "";
//         let badUserId ="123";
       
//         await server
//             .post("/login")
//             .send({email: 'omerrath@gmail.com', password: '123456' })
//             .expect((res) =>{
//                 let tokenObj = res.body;
//                 jwt.verify(tokenObj.token, secret,(err, decriptedToken) => {
//                     userId = decriptedToken;
//                 });
//                 token1 = tokenObj.token;

//             });
//             assert.notEqual(token1,"");
//             await server
//             .post("/getFilenames")
//             .set('Content-Type','application/json')
//             .set('Cookie',"{\"token\":\""+token1+"\"}")
//             .send({id: badUserId})
//             .expect(401);
      
//     });

// });


describe('Access user file list', async function() {

    fileList = []
    for (let i = 0; i < 3; i++) {
        await fs.copyFile(`${__dirname}/test_files/input_file.krn`,`../uploads/123/input_file.krn`, (err) =>{
            if(err) throw err;
        });
        fileList.push(`input_file.krn`);
    }
    
    it('should return the file list', async function() {
        let token1 = "";
        let userId ="";
        //Test - login with with valid user+pass, get the user's file list.
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
        .post("/getFilenames")
        .set('Content-Type','application/json')
        .set('Cookie',"{\"token\":\""+token1+"\"}")
        .send({id: userId})
        .expect((res) =>{
            expect(res.body).to.equal(fileList)
         })
        .expect(200);
      
        for (let i = 0; i < 3; i++) {
           fs.unlinkSync(userPath+`${i}.krn`);
        }
    });

});










