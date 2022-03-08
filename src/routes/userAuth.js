const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const path = require('path');

const uploadPath = require(path.join(__dirname, '../services/uploadsPathService'));
const genUUID = require(path.join(__dirname, '../services/uuidFactory'));
const ravendb = require(path.join(__dirname, '../dbUtils/common'));
const { User } = require('../dbUtils/modelClasses');
const jwt = require('jsonwebtoken')

router.use(express.urlencoded({ extended: false }))

router.get('/login', authenticateToken, (req, res) => {
    res.render(path.join(__dirname, '../static/login.ejs'))
})

router.post('/login', async (req, res) => {
    const user = await ravendb.findUserByEmail(req.body.email);
    try{
        console.log(req.body.password,  user.salt, user.hashedpassword)
        if ( await bcrypt.compare(req.body.password, user.salt+user.hashedpassword)){

            //return token
            const userId = { userid : user.id }

            const accessToken = jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET) //, { expiresIn: 300})
            res.json({ accessToken : accessToken })

            //redirect
            res.redirect('/');
            console.log('logged in')
        }
        else{
            res.redirect('back');
            console.log('log in failed')
        }
    }
    catch(e){
        console.log(e)
        res.redirect('back');
    }

})

router.get('/register', (req, res) => {
    res.render(path.join(__dirname, '../static/register.ejs'))
})

router.post('/register', async (req, res) => {
    console.log(req.body)
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = new User (
            await genUUID(uploadPath),
            req.body.name, 
            req.body.email, 
            salt, 
            hashedPassword.substring(29), 
        );

        ravendb.storeUser(user);

        res.redirect('/login');
    } catch (e){
        console.log(e)
        res.redirect('/register');
    }
});


router.post('/logout', (req, res) => {

})

function checkAuthenticated(req, res, next) {
    // if (isAuthenticated()) {
        // return next()
    // }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    // if (isAuthenticated()) {      
        return res.redirect('/')
    // }
    // next()
}

function isAuthenticated(userid, userToken) {
    return false;
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if ( token === null){
        //return res.sendStatus(401)
        next()
    }
    else{
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decriptedToken) => {
            if (err){
                //return res.sendStatus(403)
                next()
            }
            else{
                req.decriptedToken = decriptedToken
                console.log(decriptedToken)
                res.redirect('/');
            }
        })
    }
    
}


module.exports = [ router, checkAuthenticated ];