//in case dotenv is not in the current path, then path can be given in config file.
require("dotenv").config();
//making the database connection
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
//using the json middleware for parsing json
app.use(express.json());

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

    user.token = token; //normally token is not saved in dd, depends on devs choice.
    //whether that token should stored in db or not, just your choice

    //Avoiding sending password as response
    user.password = undefined;

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});
module.exports = app;
