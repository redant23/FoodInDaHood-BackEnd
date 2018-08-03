const express = require("express");
const router = express.Router();
const passport = require("passport");
var jwt = require("jsonwebtoken");
// const strategy = require('../passport');
const { Customer } = require("../models/Customers");
const FacebookStrategy = require("passport-facebook").Strategy;
const FacebookTokenStrategy = require("passport-facebook-token");

router.post(
  "/auth/facebook",
  passport.authenticate("facebook-token", { session: false }),
  function (req, res, next) {
    if (!req.user) {
      return res.send(401, "User Not Authenticated");
    }

    req.auth = {
      id: req.user.id
    };

    next();
  },
  generateToken,
  sendToken
);

var createToken = function (auth) {
  return jwt.sign(
    {
      id: auth.id
    },
    "my-secret",
    {
      expiresIn: 60 * 120
    }
  );
};

function generateToken(req, res, next) {
  req.token = createToken(req.auth);
  return next();
}

function sendToken(req, res) {
  res.header("x-auth-token", req.token);
  return res.json({ user: req.user, token: req.token });
}

module.exports = router;
