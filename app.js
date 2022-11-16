const express = require("express");

const app = express();

//home route
app.get("/", (req, res) => {
  res.send("<h1>Hello from Auth System</h1>");
});

module.exports = app;