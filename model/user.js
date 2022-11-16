const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email id is required"],
  },

  password: {
    //plain text storage not recommended
    type: String,
  },

  token: {
    type: String,
  },
});

//exporting the user model
module.exports = mongoose.model("User", userSchema);
