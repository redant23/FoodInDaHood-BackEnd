const mongoose = require("mongoose");


var CommentSchema = new mongoose.Schema({
  comments: [
    {
      vendor_id: { type: Object, require: true },
      customer_id: { type: Object, require: true },
      body: String,
      rate: { type: Number, require: true },
      created_at: { type: Date, require: true },
      img_url: String,
    }
  ]
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = { Comment };
