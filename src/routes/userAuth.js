const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const path = require('path');
const cookieParser = require("cookie-parser");
const parseToken = require(path.join(__dirname, '../services/tokenParser'));

const uploadPath = require(path.join(__dirname, '../services/uploadsPathService'));
const genUUID = require(path.join(__dirname, '../services/uuidFactory'));
const ravendb = require(path.join(__dirname, '../dbUtils/common'));
const { User } = require('../dbUtils/modelClasses');

const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
router.use(bodyParser.json())
// router.use(bodyParser.urlencoded({ extended: false }))
router.use(cookieParser());

// const passport = require('passport')
// const passportJWT = require("passport-jwt");
// const JWTStrategy = passportJWT.Strategy;
// const ExtractJWT = passportJWT.ExtractJwt;

// passport.use(new JWTStrategy({
//     jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.ACCESS_TOKEN_SECRET
// },
//     async function (userId, done) {
//         return ravendb.findUserById(userId)
//             .then(user => { return done(null, user); })
//             .catch(err => { return done(err); });
//     }))

router.get('/login', notValidateToken, (req, res) => {
    res.render(path.join(__dirname, '../static/login.ejs'))
})

router.get('/register', notValidateToken, (req, res) => {
    res.render(path.join(__dirname, '../static/register.ejs'))
})


router.post('/login', async (req, res) => {
    try {
        const foundUser = await ravendb.findUserByEmail(req.body.email);
        console.log('post /login foundUser ',foundUser)
        if (await bcrypt.compare(req.body.password, foundUser.salt + foundUser.hashedpassword)) {

            //logged in succeeded
            let token = genToken(foundUser);
            //res.cookie('token', token ,{maxAge:99999999999, httpOnly: true, secure: false, overwrite: true}).send('cookie set');
            res.status(200).json({ token : token });
            console.log('post /login logged in succeeded')
        }
        else {
            res.redirect('back');
            console.log('post /login logged in failed')
        }
    }
    catch (e) {
        console.log(e)
        res.redirect('back');
        console.log('post /login logged in failed')
    }

})

router.post('/register', async (req, res) => {
    //Check If User Exists
    let foundUser = await ravendb.findUserByEmail(req.body.email);

    if (foundUser) {
        return res.status(403).json({ error: 'Email is already in use' });
    }

    const salt = await bcrypt.genSalt();
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
    res.redirect('/login'); //TODO: remove token
});

function genToken(user) {
    return jwt.sign(user.id, process.env.ACCESS_TOKEN_SECRET)  //, { expiresIn: 300})
}

function validateToken(req, res, next) {
    const token = parseToken(req);
    if(!token){
        res.redirect('/login');
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decriptedToken) => {
        if (err || !decriptedToken) {
            res.redirect('/login');
            return;
        }
        let userId = decriptedToken;
        req.user = await ravendb.findUserById(userId);
        next()
    });
}

//login using this
function notValidateToken(req, res, next) {

    const token = parseToken(req);
    if(!token){
        next()
        return;
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decriptedToken) => {
        if (err || !decriptedToken) {
            next()
            return;
        }
        let userId = decriptedToken;
        req.user = await ravendb.findUserById(userId);
        res.redirect('/');
    });
}


router.use(express.urlencoded({ extended: false }))


module.exports = [ router, validateToken ];