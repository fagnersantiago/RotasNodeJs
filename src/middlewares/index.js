const jwt = require("jsonwebtoken");
const secretPass = require("../config/config");

const auth = (request, response, next) => {
  const tokenHeader = request.headers.auth;

  if (!tokenHeader) return response.status(400).send("Token unsent");

  jwt.verify(tokenHeader, secretPass.jwt_pass, (err, decoded) => {
    if (err) return response.status(401).json({ message: "Invalid Token" });

    response.locals.IdUser = decoded;

    return next();
  });
};

module.exports = auth;
