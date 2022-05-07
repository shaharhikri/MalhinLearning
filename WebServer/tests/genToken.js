const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');


function genToken(user) {
    return jwt.sign(user.id, process.env.ACCESS_TOKEN_SECRET)  //, { expiresIn: 300})
}