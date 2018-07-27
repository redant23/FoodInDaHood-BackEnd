const express = require("express");
const router = express.Router();
const passport = require('passport');
// const strategy = require('../passport');
const { Customer } = require("../models/Customers");
const FacebookStrategy = require('passport-facebook').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');

passport.use(new FacebookTokenStrategy({ // local 전략을 세움
  clientID: '2171887249551647',
  clientSecret: '616de2413c7086c4cfa3520ac67005a4',
}, (accessToken, refreshToken, profile, done) => {
  console.log('11')
  Customer.findOne({ id: profile.id }, (err, user) => {
    console.log('22')
    if (user) return done(err, user); // 회원정보가 있으면 로그인
    const newCustomer = new Customer({
      id: profile.id
    });
    newCustomer.save((user) => {
      console.log('33')
      return done(null, user); // 새로운 회원 생성 후 로그인
    })

  });
}));


router.post("/auth/facebook", passport.authenticate('facebook'), function (req, res) {
  console.log('ss')
  res.send('req.body');
});


module.exports = router;
