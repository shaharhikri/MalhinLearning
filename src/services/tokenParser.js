function getToken(req) {
    try{
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
    catch(e){
        console.log('getToken - exception catched:',e);
        return null;
    }  
}

module.exports = getToken;