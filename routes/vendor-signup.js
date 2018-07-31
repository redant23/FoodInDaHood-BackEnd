const express = require("express");
const router = express.Router();
const { Vendor } = require("../models/Vendors");
const { Category } = require("../models/Categories");
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

// 가게 등록 페이지 로드
router.get("/vendor/signup", (req, res) => {
  Category.find().then((item) => {
    res.json(item);
  });
});

// 카테고리 추가
router.post("/vendor/signup/category/add", (req, res) => {
  //req.body.foodname
  Category.find({ foodname: req.body.foodname }).then((items) => {
    if (!Object.keys(items).length) {
      var data = {
        foodname: req.body.foodname,
        vendors: []
      }
      var addCategory = new Category(data);
      console.log(addCategory);
      addCategory.save((err) => {
        if (err) {
          console.log("msg : " + err);
          res.json({ msg: err });
        } else {
          res.json(data);
        }
      })
    } else {
      res.json({ msg: '기존 카테고리에 이미 있습니다.' })
    }
  });
});

// 가게 등록
router.post("/vendor/signup/add", upload.fields([{ name: 'menuImg' }, { name: 'vendorImg' }]), (req, res) => {
  var reqData = new Vendor(req.body);
  console.log(req.files, req.body, "testpoint");
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
