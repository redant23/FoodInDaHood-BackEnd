const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const { Customer } = require("./models/Customers");
const { FBClientID, FBClientSecret } = require("./credentials");

module.exports = () => {
  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: FBClientID,
        clientSecret: FBClientSecret
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(11111111111);
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        Customer.findOrCreate(accessToken, refreshToken, profile, function (
          err,
          user
        ) {
          console.log(777777);
          return done(err, user);
        });
      }
    )
  );
};
