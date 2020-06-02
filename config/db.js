const mongoose = require("mongoose"); //add mongoose module used for db connection
const config = require("config"); //add config module
const db = config.get("mongoURI"); //get values from default json file

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err.message);
    process.exit(1); //if mongoDB fails to connect we want to exit process
  }
};

module.exports = connectDB;
