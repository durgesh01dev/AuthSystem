const jwt = require("jsonwebtoken");
//optional model

//middleware for athorization
const auth = (req, res, next) => {
  console.log(req.cookies); //the token is printed now
  //extract token from request
  //1. token can be in header, cookies, or body
  //in case Authorization key is not there, then error will come up
  //Recommended to put header one at the end since for cookies and body, the Bearer string won't be there
  //then TypeError: Cannot read properties of undefined (reading 'replace')
  //will come
  const token =
    req.cookies.token ||
    req.body.token ||
    req.header("Authorization").replace("Bearer ", "");

  //check if token is not there
  if (!token) {
    return res.status(403).send("Token is missing");
  }
  try {
    //token exists
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    /**
     * The decoded value is the payload which we provided while generating token
    { user_id: '6375aab8a3e1b9d8de836cfa',
      email: 'abc@gmail.com',
      iat: 1668667531,
      exp: 1668674731
    }
    */
    //the decoded information can be given as a property to request
    //req.user = decode;
    //or db query can be made here
    console.log(decode);
  } catch (error) {
    res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = auth;
