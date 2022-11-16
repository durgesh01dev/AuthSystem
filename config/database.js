const mongoose = require("mongoose");
const { MONGODB_URL } = process.env;

// promise is handled which is returned since the database connection is established
exports.connect = () => {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log(`DATABASE HAS CONNECTED SUCCESSFULLY!!`))
    .catch((error) => {
      console.log(`DATABASE CONNECTION FAILED`);
      console.log(error);
      process.exit(1);
    });
};
