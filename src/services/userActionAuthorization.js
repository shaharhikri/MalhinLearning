const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
const path = require('path');
const parseToken = require(path.join(__dirname, '../services/tokenParser'));

//login using this
function notValidateToken(req, res, next) {
    const token = parseToken(req);
    if(!token){
        res.status(403).json({ error : 'You are not authorized to perform this action.' });
        return;
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decriptedToken) => {
        if (err || !decriptedToken || !req.body) {
            res.status(403).json({ error : 'You are not authorized to perform this action.' });
            return;
        }
        let userId = decriptedToken;
        let userIdForAction = req.body.id;

        if (userId != userIdForAction) {
            res.status(403).json({ error : 'You are not authorized to perform this action.' });
            return;
        }
        next();
    });
}

module.exports = notValidateToken;