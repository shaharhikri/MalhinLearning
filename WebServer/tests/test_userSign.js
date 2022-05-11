const supertest = require("supertest");
const should = require("should");
const server = supertest.agent("http://localhost:8080");


describe("Register",function(){

    it("Should return 200 & proper message since all requested values are valid",function(done){

        server
        .post("/register")
        .send({name:'Omer',email: 'omer13@gmail.com', password: '123456' })
        .expect((res) =>{
            res.body.should.containEql({
                succeeded: 'succeeded'
            })
       })
       .expect(200,done)
    })

    it("Should return 200 & proper error message as the given user already exists",function(done){

        server
        .post("/register")
        .send({name:'Shahar Hikri',email: 'shaharhikri@gmail.com', password: '123456' })
        .expect((res) =>{
            res.body.should.containEql({
                error: 'Email is already in use' 
            })
        })
        .expect(200,done)
    })

    it("Should return 403 & proper error message since one or more credentials are missing",function(done){

            server
            .post("/register")
            .send({name:'',email: 'omer13@gmail.com', password: '123456' })
            .expect((res) =>{
                res.body.should.containEql({
                    error: 'Name missing' 
                })
            })
            .expect(403,done)
    })
    
})

describe("Login",function(){
    
    it("Should return 200 & token since all requested credentials are valid",function(done){

        server
        .post("/login")
        .send({email: 'shaharhikri@gmail.com', password: '123456' })
        .expect(200,done)
    })

    it("Should return 403 & proper error message as there is no such user",function(done){

        server
        .post("/login")
        .send({email: 'dganit@gmail.com', password: '123456' })
        .expect((res) =>{
            res.body.should.containEql({
                error: 'There\'s no such user' 
            })
        })
        .expect(403,done)
    })

    it("Should return 403 & proper error message as the insterted password to a given user is incorrect",function(done){

        server
        .post("/login")
        .send({email: 'shaharhikri@gmail.com', password: '789' })
        .expect((res) =>{
            res.body.should.containEql({
                error: 'Password incorrect' 
            })
        })
        .expect(403,done)
    })

    it("Should return 403 & proper error message since email input is missing",function(done){

        server
        .post("/login")
        .send({email: '', password: '123' })
        .expect((res) =>{
            res.body.should.containEql({
                error: 'Email missing' 
            })
        })
        .expect(403,done)
    })
    
    it("Should return 403 & proper error message since password input is missing",function(done){

        server
        .post("/login")
        .send({email: 'shaharhikri@gmail.com', password: '' })
        .expect((res) =>{
            res.body.should.containEql({
                error: 'Password missing' 
            })
        })
        .expect(403,done)
    })
})









