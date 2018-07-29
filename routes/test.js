const express = require("express");
const AWS = require('aws-sdk');
AWS.config.region = "ap-northeast-2";
var credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
AWS.config.credentials = credentials;
const router = express.Router();
const { Test } = require("../models/Test");
const { Comment } = require("../models/Comments");
const { Customer } = require("../models/Customers");
const { Vendor } = require("../models/Vendors");
const { Category } = require("../models/Categories");
const multer = require('multer');
const multerS3 = require('multer-s3');
const { accessKeyId, secretAccessKey } = require("../db/credentials");
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

router.post("/comment/new", upload.single('comment_img'), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  var rate = req.body.comment_rate;
  var content = req.body.comment_content;
  var date = req.body.created_at;
  var vendorId = req.body.vendor_id;
  var customerId = req.body.customer_id;
  var imgUrl = req.file.location;
  var customerName = req.body.customer_name;
  var customerImgUrl = req.body.customer_imgUrl;

  var data = {
    vendor_id: ObjectId(vendorId),
    customer_id: ObjectId(customerId),
    body: content,
    rate: rate,
    created_at: date,
    img_url: imgUrl,
    customer_name: customerName,
    customer_imgUrl: customerImgUrl
  }


  var newComment = new Comment(data);
  newComment.save((err) => {
    if (err) {
      console.log("msg : " + err);
      res.json({ msg: err });
    } else {
      Vendor.findOne({ _id: ObjectId(vendorId) }).then((item) => {
        item.comments.push(newComment._id);
        item.save((err) => {
          if (err) {
            console.log("msg : " + err);
            res.json({ msg: err });
          } else {
            Customer.findOne({ _id: ObjectId(customerId) }).then((item) => {
              item.comments.push(newComment._id);
              item.save((err) => {
                if (err) {
                  console.log("msg : " + err);
                  res.json({ msg: err });
                } else {
                  res.json({ msg: 'success upload' });
                }
              });
            });
          };
        });
      });
    }
  })
});

router.get("/comment/list", (req, res) => {
  var targetId = req.query.vendorId;
  Comment.find({ vendor_id: ObjectId(targetId) }).then(items => {
    res.json(items);
  }).catch(err => {
    console.log(err);
    console.error(err);
  });
});

router.get("/category/list", (req, res) => {
  var targetId = req.query.vendorId;
  Category.find({ vendor_id: targetId }).then(items => {
    res.json(items);
  }).catch(err => {
    console.error(err);
  });
});

router.get("/customer/mycomments", (req, res) => {
  var targetId = req.query.customerId;
  Customer.find({ Customer_id: targetId }).then(items => {
    var renderlist = {
      comments: items.comments,
    }
    res.json(renderlist);
  }).catch(err => {
    console.error(err);
  });
});

router.get("/customer/myfavoritetrucks", (req, res) => {
  var targetId = req.query.customerId;
  Customer.find({ Customer_id: targetId }).then(items => {
    var renderlist = {
      my_favorite_trucks: items.my_favorite_trucks
    }
    res.json(renderlist);
  }).catch(err => {
    console.error(err);
  });
});

router.post("/favorite/add", (req, res) => {
  console.log(req.body);
  var customerId = req.body.customerId;
  var vendorId = req.body.vendorId;
  Vendor.findOne({ _id: ObjectId(vendorId) }).then((vendorItem) => {
    console.log('vendoritemadd', vendorItem, 1111111)
    vendorItem.favorites.push(ObjectId(customerId));
    console.log('vendorfavoriteadd', vendorItem.favorites, 222222)
    vendorItem.save((err) => {
      if (err) {
        console.log("msg : " + err);
        res.json({ msg: err });
      } else {
        Customer.findOne({ _id: ObjectId(customerId) }).then((customerItem) => {
          console.log(333)
          customerItem.my_favorite_trucks.push(ObjectId(vendorId));
          customerItem.save((err) => {
            if (err) {
              console.log("msg : " + err);
              res.json({ msg: err });
            } else {
              res.json({ msg: 'success add favorite' });
            }
          })
        })
      }
    })
  })
});

router.post("/favorite/remove", (req, res) => {

  var customerId = req.body.customerId;
  var vendorId = req.body.vendorId;
  Vendor.findOne({ _id: ObjectId(vendorId) }).then((vendorItem) => {

    var favorites = vendorItem.favorites.filter((favorite) => {
      if (favorite._id.toString() !== customerId) {
        return favorite;
      }
    })
    vendorItem.favorites = favorites;
    vendorItem.save((err) => {
      if (err) {
        console.log("msg : " + err);
        res.json({ msg: err });
      } else {
        Customer.findOne({ _id: ObjectId(customerId) }).then((customerItem) => {
          var myfavoritetrucks = customerItem.my_favorite_trucks.filter((favoritetruck) => {
            console.log('favoritetruck._id', favoritetruck._id.toString())
            console.log('vendorId.toString', vendorId)
            if (favoritetruck._id.toString() !== vendorId) {
              return favoritetruck;
            }
          })
          console.log(22222, myfavoritetrucks)
          customerItem.my_favorite_trucks = myfavoritetrucks;
          console.log(33333, customerItem.my_favorite_trucks)
          customerItem.save((err) => {
            if (err) {
              console.log("msg : " + err);
              res.json({ msg: err });
            } else {
              res.json({ msg: 'success remove favorite' });
            }
          })
        })
      }
    })
  })
});


router.post("/testRequest", upload.single('photo'), (req, res) => {
  console.log('testRequest')
  console.log(req.file)
  res.send('hi test');
});

module.exports = router;
