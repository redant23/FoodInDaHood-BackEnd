const mongoose = require("mongoose");

var TestSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  created_at: {
    type: Date,
    require: true
  },
  visits: {
    type: Array
  }
});

var Test = mongoose.model("Test", TestSchema);

module.exports = { Test };
