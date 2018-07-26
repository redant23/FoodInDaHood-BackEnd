const express = require("express");
const router = express.Router();
const { Test } = require("../models/Test");

router.post("/testRequest", (req, res) => {
  console.log(req.file)
  res.send('hi test')
});

module.exports = router;
