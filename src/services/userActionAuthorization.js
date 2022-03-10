const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
const path = require('path');
const parseToken = require(path.join(__dirname, '../services/tokenParser'));


function tokenActionAuthorizationMiddleware(req, res, next) {
    const ifAuthorized = () => { next(); };
    const ifForbidden = () => { res.status(403).json({ error : 'You are not authorized to perform this action.' }); };
    if(!req || !req.body){
        ifForbidden();
        console.log('tokenActionAuthorizationMiddleware ifForbidden')
        return;
    }
    const token = parseToken(req);
    const userIdForAction = req.body.id;
    isAuthorized(token, userIdForAction, ifAuthorized, ifForbidden);
}

function isAuthorized(token, userIdForAction, ifAuthorized, ifForbidden) {
    if(!token){
        ifForbidden();
        return;
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decriptedToken) => {
        if (err || !decriptedToken) {
            ifForbidden();
            return;
        }
        let userId = decriptedToken;

        if (userId != userIdForAction) {
            ifForbidden();
            return;
        }
        ifAuthorized();
    });
}

module.exports = { tokenActionAuthorizationMiddleware: tokenActionAuthorizationMiddleware, vaildateToken: isAuthorized }