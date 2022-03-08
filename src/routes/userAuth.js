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
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false }))

const passport = require('passport')
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
},
    async function (userId, done) {
        console.log("jwtPayload:", userId)
        return ravendb.findUserById(userId)
            .then(user => { return done(null, user); })
            .catch(err => { return done(err); });
    }))

router.get('/login', notValidateToken, (req, res) => {
    res.render(path.join(__dirname, '../static/login.ejs'))
})

router.get('/register', (req, res) => {
    res.render(path.join(__dirname, '../static/register.ejs'))
})


router.post('/login', async (req, res) => {
    const user = await ravendb.findUserByEmail(req.body.email);
    try {
        console.log(req.body.password, user.salt, user.hashedpassword)
        if (await bcrypt.compare(req.body.password, user.salt + user.hashedpassword)) {

            //return token
            const userId = { userid: user.id }

            const token = genToken(user);
            res.status(200).json({ token : token })

            //redirect
            res.redirect('/');
            console.log('logged in')
        }
        else {
            res.redirect('back');
            console.log('log in failed')
        }
    }
    catch (e) {
        console.log(e)
        res.redirect('back');
    }

})

router.post('/register', async (req, res) => {
    //Check If User Exists
    console.log('register post ',req.body)
    let foundUser = await ravendb.findUserByEmail(req.body.email);
    console.log(foundUser);

    if (foundUser) {
        return res.status(403).json({ error: 'Email is already in use' });
    }

    const salt = await bcrypt.genSalt();
    console.log('line 80 ',salt,req.body.password, req.body)
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User(
        await genUUID(uploadPath),
        req.body.name,
        req.body.email,
        salt,
        hashedPassword.substring(29),
    );
    await ravendb.storeUser(newUser);

    // Generate JWT token
    const token = genToken(newUser);
    res.status(200).json({ token : token }) //TODO: remove token
});

router.get('/secret', validateToken, (req, res,) => {
    res.json("Secret Data " + req.decriptedToken)
})

function genToken(user) {
    return jwt.sign(user.id, process.env.ACCESS_TOKEN_SECRET)  //, { expiresIn: 300})
}

function validateToken(req, res, next) {
    let cookie = JSON.parse(req.headers.cookie);
    console.log('cookies: ', cookie)
    let token = cookie.token;

    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decriptedToken) => {
        console.log('decriptedToken: ', decriptedToken)
        if (err || !decriptedToken) {
            res.redirect('/login');
            return;
        }
        req.decriptedToken = decriptedToken
        console.log(decriptedToken)
        next()
    });
}

function notValidateToken(req, res, next) {
    let cookie = JSON.parse(req.headers.cookie);
    console.log('cookies: ', cookie)
    let token = cookie.token;
    
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decriptedToken) => {
        console.log('decriptedToken: ', decriptedToken)
        if (err || !decriptedToken) {
            next()
            return;
        }
        req.decriptedToken = decriptedToken
        console.log(decriptedToken)
        res.redirect('/');
    });
}


router.use(express.urlencoded({ extended: false }))


module.exports = [ router, validateToken ];