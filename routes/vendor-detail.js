const express = require("express");
const router = express.Router();
const { Vendor } = require("../models/Vendors");
const { Category } = require("../models/Categories");
const { Comment } = require("../models/Comments");
const vendors_samples = require("../db/vendor_samples.js");

router.get("/vendor/vendor-detail", (req, res) => {
  var targetId = req.query.vendorId;
  Vendor.findOne({ _id: targetId }).then(((item) => {
    if (item.food_categories.length || item.comments.length) {
      if (item.food_categories.length) {
        Category.find({ vendors: { vendor_id: item._id } }).then((categoryItems) => {
          var foodCategories = categoryItems;
          if (item.comments.length) {
            Comment.find({ vendor_id: item._id }).then((CommentItems) => {
              let comments = CommentItems;
              item.food_categories = foodCategories;
              item.comments = comments;
              console.log('both', item);
              res.json(item);
              return;
            }).catch((err) => {
              console.error(err);
            });
          } else {
            item.food_categories = foodCategories;
            res.json(item);
            console.log('onlyFoodCategories', item);
            return;
          }
        }).catch((err) => {
          console.error(err);
        })
      } else if (item.comments.length) {
        Comment.find({ vendor_id: item._id }).then((CommentItems) => {
          let comments = CommentItems;
          item.comments = comments;
          console.log('onlyComments', item);
          res.json(item);
          return;
        }).catch((err) => {
          console.error(err);
        })
      }
    } else {
      item.food_categories = [];
      item.comments = [];
      console.log('bothEmpty', item);
      res.json(item);
      return;
    }
  })).catch((err) => {
    console.error(err);
  })
});


module.exports = router;
