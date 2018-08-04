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


router.get("/category/list", (req, res) => {
  var targetId = req.query.vendorId;
  Category.find({ vendor_id: targetId }).then(items => {
    res.json(items);
  }).catch(err => {
    console.error(err);
  });
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

router.get("/customer/myfavoritetrucks", (req, res) => {
  var targetId = req.query.customerId;
  Customer.find({ _id: ObjectId(targetId) }).then(items => {
    if (items.length) {
      var customerVendorlist = items[0].my_favorite_trucks;
      var resultArr = [];
      Vendor.find().then((vendorItems) => {
        vendorItems.forEach((vItem) => {
          customerVendorlist.forEach((cvItem) => {
            if (vItem._id.toString() === cvItem._id.toString()) {
              resultArr.push(vItem);
            }
          });
        });
        if (resultArr.length) {
          res.json(resultArr);
        } else {
          res.json({ msg: '현재 즐겨찾는 트럭이 없군요.' });
        }
      }).catch((err) => {
        res.json({ msg: err });
      })
    } else {
      res.json({ msg: '아이디에 오류가 있습니다.' })
    }
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

router.get("/vendor/vendor-detail", (req, res) => {
  var targetId = req.query.vendorId;
  Vendor.findOne({ _id: ObjectId(targetId) }).then((item) => {
    console.log('item', item);
    if (item.food_categories.length) {
      console.log("oid", ObjectId(targetId));
      Category.find().then((results) => {
        var resultArr = [];
        results.forEach((result) => {
          if (result.vendors.some((vendor) => {
            return vendor._id.toString() === targetId;
          })) {
            resultArr.push(result);
          }
        })
        item.food_categories_info = resultArr;
        console.log('resultArr', resultArr);
        res.json(item);
        return;
      }).catch((err) => {
        res.json({ msg: err });
      })
    } else {
      res.json(item);
    }
  })
    .catch((err) => {
      res.json({ msg: err });
    });
});

router.post("/testRequest", upload.single('photo'), (req, res) => {
  console.log('testRequest')
  console.log(req.file)
  res.send('hi test');
});

router.get("/addCategory", (req, res) => {
  console.log('here');
  res.json(req.query);

  // Vendor.findById(target).then((targetItem) => {
  //   targetItem.menus.push(menuDatas);
  //   targetItem.save((err) => {
  //     if (err) {
  //       console.log("msg : " + err);
  //       res.json({ msg: err });
  //     } else {
  //       res.json({ msg: 'success add menu' });
  //     }
  //   })
  // }).catch((err) => {
  //   res.json({ msg: err });
  // })
});


router.post("/vendor/addmenu", upload.single('menuimage'), (req, res) => {
  var target = req.body.vendorId;
  var checkbox = false;
  if (req.body.ismainmenu === 'on') {
    checkbox = true;
  }
  var menuDatas = {
    name: req.body.menuname,
    price: req.body.menuprice,
    description: req.body.menudescription,
    img_url: req.file.location,
    is_main_menu: checkbox
  }
  Vendor.findById(target).then((targetItem) => {
    targetItem.menus.push(menuDatas);
    targetItem.save((err) => {
      if (err) {
        console.log("msg : " + err);
        res.json({ msg: err });
      } else {
        res.json({ msg: 'success add menu' });
      }
    })
  }).catch((err) => {
    res.json({ msg: err });
  })
});



module.exports = router;
