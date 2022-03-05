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
const genUUID = require(path.join(__dirname, '../services/uuidGenService'));

const initializePassport = require(path.join(__dirname, '../services/passport-config'));
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = [{id:"0fd7a20890532b194be72a3f9a28ba2f",
                name:"Shahar Hikri",
                email:"shaharhikri@gmail.com",
                salt:"$2b$10$2kb1THQ8vKthKvjcsZRfje",
                hashedpassword:"z5j2TuaCuYd13QiU.2tp2EBxq1HsDXm"}]

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
        const user = { 
            id: genUUID(uploadPath),
            name: req.body.name, 
            email: req.body.email, 
            salt: salt, 
            hashedpassword: hashedPassword.substring(29), 
        };
        users.push(user);
        console.log(JSON.stringify(user)+'\n'+hashedPassword)
        res.redirect('/login');
    } catch {
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
    // if cookie exist - login by that

    //elif
    if (req.isAuthenticated()) {
        // if cookie doen't exist - create it.
        
        return res.redirect('/')
    }
    next()
}

module.exports = [ router, checkAuthenticated ];