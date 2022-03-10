const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
const path = require('path');
const parseToken = require(path.join(__dirname, '../services/tokenParser'));
let ravendb = require(path.join(__dirname, '../dbUtils/common'));

function genToken(user) {
    return jwt.sign(user.id, process.env.ACCESS_TOKEN_SECRET)  //, { expiresIn: 300})
}

//main page using this
function tokenConnectedAuthenticationMiddleware(req, res, next) {
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
        console.log('validateToken',userId)
        req.user = await ravendb.findUserById(userId);
        if (!req.user) {
            res.redirect('/login');
            return;
        }
        next()
    });
}

//login/register using this
function tokenSignAuthenticationMiddleware(req, res, next) {

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
        console.log('notValidateToken',userId)
        req.user = await ravendb.findUserById(userId);
        if (!req.user) {
            next()
            return;
        }
        res.redirect('/');
    });
}


module.exports = { genToken: genToken, tokenConnectedAuthenticationMiddleware: tokenConnectedAuthenticationMiddleware, tokenSignAuthenticationMiddleware: tokenSignAuthenticationMiddleware };