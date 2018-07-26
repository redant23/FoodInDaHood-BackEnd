const express = require("express");
const router = express.Router();
const { Vendor } = require("../models/Vendors");
const vendors_samples = require("../db/vendor_samples.js");

router.get("/vendor/vendor-detail", (req, res) => {
  var targetId = '5b571a31885f9e2a74681454'; //req.query.vendorId
  Vendor.find({ _id: targetId }).then(((item) => {
    res.json(item)
  }))
});


module.exports = router;
