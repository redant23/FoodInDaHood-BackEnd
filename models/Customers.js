const mongoose = require("mongoose");


var CustomerSchema = new mongoose.Schema({
  username: { type: String, require: true },
  nickname: String,
  email: { type: String, require: true, unique: true, },
  comments: [
    {
      comment_id: { type: Object, require: true, unique: true },
    }
  ],
  my_favorite_trucks: [{ type: String, require: true }]
});

var Customer = mongoose.model("Customer", CustomerSchema);

module.exports = { Customer };
