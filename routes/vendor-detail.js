const express = require("express");
const router = express.Router();
const { Vendor } = require("../models/Vendors");
const { Category } = require("../models/Categories");
const { Comment } = require("../models/Comments");
const vendors_samples = require("../db/vendor_samples.js");

router.get("/vendor/vendor-detail", (req, res) => {
  var targetId = req.query.vendorId;
  Vendor.findOne({ _id: targetId }).then((item) => {
    res.json(item);
    return;
  })
    .catch((err) => {
      console.error(err);
    });
});


module.exports = router;
