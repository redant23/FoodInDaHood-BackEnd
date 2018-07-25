const mongoose = require("mongoose");

var CategorySchema = new mongoose.Schema({
  foodname: { type: String, require: true, unique: true },
  vendors: [
    {
      vendor_id: { type: Object, require: true, unique: true }
    }
  ]
});

var Category = mongoose.model("Category", CategorySchema);

module.exports = { Category };
