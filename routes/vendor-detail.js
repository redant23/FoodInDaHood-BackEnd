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


//

// var samples1 = new Vendor(test1);

// samples1.save(function (err) {
//   console.log('ok 1')
//   if (err) {
//     console.log(err, 11)
//   }
//   samples2.save(function (err) {
//     console.log('ok 2')
//     if (err) {
//       console.log(err, 22)
//     }

// res.send({ samples1, samples2, samples3 })

module.exports = router;

/*
 *   
 * var a = [];
  vendors_samples.vendors_sampledata.forEach((vendor, i) => {

    var sample = new Vendor(vendor);

    sample.save(function (err) {
      if (err) {
        console.log("msg : " + vendor.title + err);
      } else {
        a.push(i);
      }
      if (a.length === vendors_samples.vendors_sampledata.length) {
        res.send('success!');
      }
    })

  })
 * 
 */
