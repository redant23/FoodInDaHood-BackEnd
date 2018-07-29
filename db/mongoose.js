const mongoose = require("mongoose");
const { dbuser, dbpassword } = require("./credentials");

mongoose.Promise = global.Promise;

const DB_URL = `mongodb://${dbuser}:${dbpassword}@ds147011.mlab.com:47011/foodindahood`;
console.log(DB_URL);
mongoose.connect(DB_URL, { useNewUrlParser: true });

const db = mongoose.connection;

db.once("open", function () {
  console.log("connected to database at " + DB_URL);
});

module.exports = {
  mongoose
};
