const mongoose = require("mongoose");


var VendorSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  img_url: { type: String, require: true },
  permission_no: { type: String, require: true },
  address: { type: String, require: true },
  lat: { type: Number, require: true },
  lng: { type: Number, require: true },
  tel: { type: String, require: true },
  owner: { type: String, require: true },
  join_date: { type: Date, require: true },
  open_time: { type: Date, require: true },
  close_time: { type: Date, require: true },
  food_categories_info: [],
  favorites: [
    {
      customer_id: { type: Object, require: true }
    }
  ],
  rate: { type: Number },
  food_categories: [
    {
      category_id: { type: Object, require: true }
    }
  ],
  menus: [

  ],
  comments: [
    {
      comment_id: { type: Object, require: true },
    }
  ]
});

var Vendor = mongoose.model("Vendor", VendorSchema);

module.exports = { Vendor };
