const supertest = require("supertest");
const should = require("should");
const server = supertest.agent("http://localhost:8080");
const path = require('path');
const fs = require('fs');
var expect = require('chai').expect;
var assert = require('chai').assert;;
const userPath = path.join(__dirname, '../uploads/123/');
const jwt = require('jsonwebtoken');




describe('when login', function() {

    let secret = "350acf30b4ad99a7d609e61d247027ff754e686532427d5ac6498f933a92305f74e5109a15693ad87e1544e97d70aea858c79d0d3722cc92ac7c29143f0a8a95";
   
    it('Should login and return a valid token.', async function() {
        let token1 = "";

        //Test - login with with valid user+pass - Should login and return a valid token.
        await server
            .post("/login")
            .send({email: 'shaharhikri@gmail.com', password: '123456' })
            .expect(200)
            .expect((res) =>{
                let tokenObj = res.body;
                jwt.verify(tokenObj.token, secret,(err, decriptedToken) => {
                    assert.equal(err,undefined);
                    let userId = decriptedToken;
                    assert.equal(userId,"Users/123");
                });
            token1 = tokenObj.token;
            });

       //Test - auto login with with a valid token - Should login.
        assert.notEqual(token1,"");
        await server
            .get("/login")
            .set('Cookie',"{\"token\":\""+token1+"\"}")
            .expect('Location', '/'); // login succeeded

        //Test - auto login with with NOT valid token - Should NOT login.
        let wrongToken1 = "KSJNDSKLDFNS131";
        await server
            .get("/login")
            .set('Cookie',"{\"token\":\""+wrongToken1+"\"}")
            .expect((res) =>{
                // Ensure header does not exist (login succeeded)
                expect(res.headers).to.not.have.key('Location');
            });
      
    });

});



// function deleteFolderRecursive(path) {
//     var files = [];
//     if( fs.existsSync(path) ) {
//         files = fs.readdirSync(path);
//         files.forEach(function(file,index){
//             var curPath = path + "/" + file;
//             if(fs.lstatSync(curPath).isDirectory()) { // recurse
//                 deleteFolderRecursive(curPath);
//             } else { // delete file
//                 fs.unlinkSync(curPath);
//             }
//         });
//         fs.rmdirSync(path);
//     }
// }

//     // if(fs.existsSync(userPath))
//     //     deleteFolderRecursive(userPath);

//     // if(!fs.existsSync(userPath))
//     //     fs.mkdirSync(userPath);

//     // let fileList = [];

//     // for (let index = 1; index <= 3; index++) {
//     //     fileList.push(index +'.txt');
//     //     fs.writeFile(userPath+index+'.txt','omer',function(err){
//     //         if (err) throw err;
//     //     });
//     // }
