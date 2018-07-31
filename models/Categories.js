const mongoose = require("mongoose");

var CategorySchema = new mongoose.Schema({
  foodname: { type: String, require: true },
  vendors: [
    {
      vendor_id: { type: Object, require: true }
    }
  ]
});

var Category = mongoose.model("Category", CategorySchema);

module.exports = { Category };
