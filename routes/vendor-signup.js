const express = require("express");
const router = express.Router();
const { Vendor } = require("../models/Vendors");
const vendors_samples = require("../db/vendor_samples.js");
const AWS = require('aws-sdk');
AWS.config.region = "ap-northeast-2";
var credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
AWS.config.credentials = credentials;
const multer = require('multer');
const multerS3 = require('multer-s3');


const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'foodindahood',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      console.log('metadata')
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      console.log(file, cb)
      const fileName = `${Date.now().toString()}-${file.originalname}`;
      cb(null, fileName);
    }
  })
});

// 가게 등록
router.post("/vendor/signup", upload.fields([{}]), (req, res) => {
  var reqData = new Vendor(req.body);
  reqData.save(function (err) {
    if (err) {
      console.log(err)
    } else {
      res.json({ msg: 'success' });
    }
  });
});

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
// });

module.exports = router;

// var a = [];
// vendors_samples.vendors_sampledata.forEach((vendor, i) => {
//   var sample = new Vendor(vendor);

//   sample.save(function (err) {
//     if (err) {
//       console.log("msg : " + vendor.title + err);
//     } else {
//       a.push(i);
//     }
//     if (a.length === vendors_samples.vendors_sampledata.length) {
//       // res.send("success!");
//     }
//   });
// });
