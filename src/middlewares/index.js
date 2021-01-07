const jwt = require('jsonwebtoken');

const auth = (request, response, next) =>{

    const tokenHeader =  request.headers.auth;

if(!tokenHeader) return response.send("Token unsent");

jwt.verify(tokenHeader, 'secret',(err, decoded) =>{
    if(err) return response.send(404, { message: "Invalid Token"});

    response.locals.IdUser = decoded

    return next();
});

}


module.exports = auth;