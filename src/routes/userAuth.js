const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const path = require('path');

const uploadPath = require(path.join(__dirname, '../services/uploadsPathService'));
const genUUID = require(path.join(__dirname, '../services/uuidFactory'));
const ravendb = require(path.join(__dirname, '../dbUtils/common'));
const { User } = require('../dbUtils/modelClasses');

const initializePassport = require(path.join(__dirname, '../services/passport-config'));
initializePassport(
    passport,
    ravendb.findUserByEmail,
    ravendb.findUserById
)

router.use(express.urlencoded({ extended: false }))
router.use(flash())
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, 
    cookie: {
        secure: false,
        maxAge: 2592000000
    }
}))
router.use(passport.initialize())
router.use(passport.session())

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render(path.join(__dirname, '../static/login.ejs'))
})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render(path.join(__dirname, '../static/register.ejs'))
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
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
        res.redirect('/register');
    }
});


router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {      
        return res.redirect('/')
    }
    next()
}

module.exports = [ router, checkAuthenticated ];