const jwt = require("jsonwebtoken");
//optional model

//middleware for athorization
const auth = (req, res, next) => {
  //extract token from request
  //1. token can be in header, cookies, or body
  //in case Authorization key is not there, then error will come up
  const token =
    req.header("Authorization").replace("Bearer ", "") ||
    req.cookies.token ||
    req.body.token;

  //check if token is not there
  if (!token) {
    return res.status(403).send("Token is missing");
  }
  try {
    //token exists
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    /**
    { user_id: '6375aab8a3e1b9d8de836cfa',
      email: 'abc@gmail.com',
      iat: 1668667531,
      exp: 1668674731
    }
     */
    console.log(decode);
  } catch (error) {
    res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = auth;
