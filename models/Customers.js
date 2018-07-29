const mongoose = require("mongoose");

var CustomerSchema = new mongoose.Schema({
  username: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  comments: [
    {
      comment_id: { type: Object, require: true, unique: true }
    }
  ],
  my_favorite_trucks: [{ type: String, require: true }]
});

CustomerSchema.statics.findOrCreate = function (
  accessToken,
  refreshToken,
  profile,
  cb
) {
  console.log(2222222222);
  var that = this;
  return this.findOne(
    {
      "facebookProvider.id": profile.id
    },
    function (err, customer) {
      // no customer was found, lets create a new one
      console.log(333333333);
      if (!customer) {
        console.log(444444444);
        var newCustomer = new that({
          username: profile.displayName,
          email: profile.emails[0].value,
          comments: [],
          my_favorite_trucks: []
        });

        newCustomer.save(function (error, savedcustomer) {
          console.log(5555555);
          if (error) {
            console.log(error);
          }
          return cb(error, savedcustomer);
        });
      } else {
        console.log(6666666);
        return cb(err, customer);
      }
    }
  );
};

var Customer = mongoose.model("Customer", CustomerSchema);

module.exports = { Customer };
