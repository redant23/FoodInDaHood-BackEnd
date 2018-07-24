const express = require("express");
const router = express.Router();
const { Test } = require("../models/Test");

router.get("/testRequest", (req, res) => {
  res.send("ok");
});

module.exports = router;
