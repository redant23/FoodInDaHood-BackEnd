const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const { Customer } = require("./models/Customers");


module.exports = () => {
  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: process.env.API_FB_CLIENT_ID,
        clientSecret: process.env.API_FB_CLIENT_SECRET
      },
      (accessToken, refreshToken, profile, done) => {
        Customer.findOrCreate(accessToken, refreshToken, profile, function (
          err,
          user
        ) {
          return done(err, user);
        });
      }
    )
  );
};
