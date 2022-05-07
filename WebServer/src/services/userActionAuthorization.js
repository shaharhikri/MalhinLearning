const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
const path = require('path');
const parseToken = require(path.join(__dirname, '../services/tokenParser'));


function tokenActionAuthorizationMiddleware(req, res, next) {
    try{
        const ifAuthorized = () => { next(); };
        const ifForbidden = () => { res.status(401).json({ error : 'You are not authorized to perform this action.' }); };
        
        if(!req || !req.body){
            ifForbidden();
            return;
        }
        const token = parseToken(req);
        const userIdForAction = req.body.id;
        isAuthorized(token, userIdForAction, ifAuthorized, ifForbidden);
    }
    catch {
        res.status(500).send();
    }
}

function isAuthorized(token, userIdForAction, ifAuthorized, ifForbidden) {
    try{
        if(!token || !userIdForAction){
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
    catch {
        ifForbidden();
    }
}

module.exports = { tokenActionAuthorizationMiddleware: tokenActionAuthorizationMiddleware, vaildateToken: isAuthorized }