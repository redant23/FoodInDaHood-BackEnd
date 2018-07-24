const express = require("express");
const router = express.Router();
const { Test } = require("../models/Test");

router.get("/testRequest", (req, res) => {
  res.send("okhihiQQQ");
});

module.exports = router;
