const mongoose = require('mongoose');
require('dotenv').config()
async function dbConnection() {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connedtion Successful")
    }
    catch (error) {
        console.log("Connection Failed", error.message);
    }
  }

  module.exports = dbConnection;