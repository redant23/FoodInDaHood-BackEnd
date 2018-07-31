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
const { ObjectId } = require('mongodb');

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
router.post("/vendor/signup/add", upload.fields([{ name: 'image' }, { name: 'menuPhoto' }]), (req, res) => {

  console.log(req.files, req.body, "testpoint");
  console.log(JSON.parse(req.body.menu))

  var menuArr = JSON.parse(req.body.menu).map((menu, i) => {
    console.log('menu', menu)
    menu.img_url = req.files.menuPhoto[i].location;
    return menu;
  })

  console.log('menuArr', menuArr);

  var food_categories_data = JSON.parse(req.body.foodCategory);

  var newData = {
    title: req.body.title,
    description: req.body.description,
    permission_no: req.body.permissionNumber,
    address: req.body.address,
    lat: Number(req.body.lat),
    lng: Number(req.body.lng),
    tel: req.body.phoneNumber,
    owner: req.body.owner,
    join_date: req.body.joinDate,
    open_time: new Date(2000, 0, 1, req.body.openTime.split(":")[0], req.body.openTime.split(":")[1]),
    close_time: new Date(2000, 0, 1, req.body.closeTime.split(":")[0], req.body.closeTime.split(":")[1]),
    img_url: req.files.image[0].location,
    menus: menuArr,
    food_categories: []
  };

  var renderData = new Vendor(newData);
  var willSavedatas = [];
  food_categories_data.forEach((food_category, idx) => {
    Category.findOne({ foodname: food_category }).then((item) => {
      if (item) {
        renderData.food_categories.push(item._id);
        item.vendors.push(renderData._id);
        item.save((err) => {
          if (err) {
            console.log("msg : " + err);
            res.json({ msg: err });
          }
        });
        if (food_categories_data.length - 1 === idx) {
          renderData.save((err) => {
            if (err) {
              console.log("msg : " + err);
              res.json({ msg: err });
            } else {
              res.json({ msg: 'success1!' });
            }
          })
        }
      } else {
        var categoryAddData = {
          foodname: food_category,
          vendors: []
        }
        var categoryAdd = new Category(categoryAddData);
        categoryAdd.vendors.push(ObjectId(renderData._id));
        renderData.food_categories.push(categoryAdd._id);
        willSavedatas.push(categoryAdd);
        if (idx === food_categories_data.length - 1) {
          renderData.save((err) => {
            if (err) {
              console.log("msg : " + err);
              res.json({ msg: err });
            } else {
              willSavedatas.forEach((categoryData, i) => {
                categoryData.save((err) => {
                  if (err) {
                    console.log("msg : " + err);
                    res.json({ msg: err });
                  }
                  if (willSavedatas.length - 1 === i) {
                    res.json({ msg: 'success2!' });
                  }
                })
              })
            }
          })

        }
      }
    }).catch((err) => {
      res.json({ msg: err });
    });
  })




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
