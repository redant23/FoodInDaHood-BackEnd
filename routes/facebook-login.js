const express = require("express");
const router = express.Router();
const passport = require('passport');
const strategy = require('../passport');
const { Customer } = require("../models/Customers");

router.post("/auth/facebook", passport.authenticate('facebook', {
  authType: 'rerequest', scope: ['public_profile', 'email']
}), function (req, res) {
  res.send('router');
});

router.post("/auth/facebook/callback", passport.authenticate('facebook', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/');
  });


module.exports = router;
