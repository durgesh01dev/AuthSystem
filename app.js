//in case dotenv is not in the current path, then path can be given in config file.
require("dotenv").config();

//making the database connection
require("./config/database").connect();
const express = require("express");
const jwt = require("jsonwebtoken");

//middlewares
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const auth = require("./middleware/auth");

const app = express();
//using the json middleware for parsing json
app.use(express.json());
//using cookie parser middleware to parse cookie
app.use(cookieParser());

const User = require("./model/user");

//home route
app.get("/", (req, res) => {
  res.send("<h1>Hello from Auth System</h1>");
});

//user signup/register
app.post("/signup", async (req, res) => {
  try {
    //1. destructuring firstname, lastname, email from req.body
    const { firstName, lastName, email, password } = req.body;
    //2. checking the mandatory fields presence
    if (!(email && password && firstName && lastName)) {
      res.status(400).send("All fields are required");
    }
    //3. checking whether the user is already registered
    const existingUser = await User.findOne({ email: email }); // returns PROMISE
    //user with email is already registered
    if (existingUser) {
      res.status(401).send("User already exists");
    }

    //encrypt the password, how many round of that algo should be used
    //10 is that salt value
    const myEncryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: myEncryptedPassword,
    });

    //generating the token
    //payload, the unique id will be accessed from mongoDB
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token; //normally token is not saved in db, depends on devs choice.
    //whether that token should stored in db or not, just your choice

    //Avoiding sending password as response
    user.password = undefined;

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

//login or signin user
app.post("/signin", async (req, res) => {
  try {
    //1. get login details from request by destructuring
    const { email, password } = req.body;

    //2. check if email passwords exist in body
    if (!(email && password)) {
      res.status(400).json("Required Fields are missing for login");
    }
    //3. get user from database, since it can take time
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).send("You are not registered in the auth system");
    }
    //user exists
    //4. Compare and verify the password, this comparison process can take time, so use await here
    if (await bcrypt.compare(password, user.password)) {
      //password is correct, token creation
      //here headers are not required, directly working on payload, secret key, further expiresIn
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      //make password undefined for response
      user.password = undefined;

      //to send cookies
      const options = {
        //3 days, 24 hours, 60mins 60 sec, and 1000 for milliseconds
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        //only the backend part can check this
        httpOnly: true,
      };

      res.status(200).cookie("token", token, options).json({
        success: true,
        user,
      });
    } else {
      //message can be refine based on the application requirement
      res.status(400).send("Either email or password is incorrect.");
    }
    //5. give token or other info to user
  } catch (error) {
    console.log(error);
  }
});

//only logged in user should view, use token here
//using middleware for user authorization
app.get("/dashboard", auth, (req, res) => {
  res.status(200).send("Some SECRET INFORMATION !!");
});
module.exports = app;
