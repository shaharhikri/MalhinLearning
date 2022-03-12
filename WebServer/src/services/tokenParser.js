function getToken(req) {
    try{
        if (!req || !req.headers || !req.headers.cookie ){
            return null;
        }
        const firstCookie = req.headers.cookie.split(";")[0];
        const tokenObj = JSON.parse(firstCookie);
        if ( !tokenObj.token ){
            return null;
        }
        const token = tokenObj.token;
        
        return token;
    }
    catch(e){
        return null;
    }  
}

module.exports = getToken;