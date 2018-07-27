const express = require("express");
const AWS = require('aws-sdk');
AWS.config.region = "ap-northeast-2";
var credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
AWS.config.credentials = credentials;
const router = express.Router();
const { Test } = require("../models/Test");
const multer = require('multer');
const multerS3 = require('multer-s3');
const { accessKeyId, secretAccessKey } = require("../db/credentials");



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


router.post("/testRequest", upload.single('photo'), (req, res) => {
  console.log('testRequest')
  console.log(req.file)
  res.send('hi test');
});

module.exports = router;
