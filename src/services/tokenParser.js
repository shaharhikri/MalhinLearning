function getToken(req) {
    if (!req || !req.headers || !req.headers.cookie ){
        return null;
    }
    const tokenObj = JSON.parse(req.headers.cookie);
    if ( !tokenObj.token ){
        return null;
    }
    const token = tokenObj.token;
    
    return token;
}

module.exports = getToken;