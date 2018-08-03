const mongoose = require("mongoose");

var CustomerSchema = new mongoose.Schema({
  facebookProviderId: String,
  username: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  picture: String,
  comments: [
    {
      comment_id: { type: Object, require: true }
    }
  ],
  my_favorite_trucks: [
    {
      vendor_id: { type: Object, require: true }
    }
  ]
});

CustomerSchema.statics.findOrCreate = function (
  accessToken,
  refreshToken,
  profile,
  cb
) {
  var that = this;
  return this.findOne(
    {
      "facebookProviderId": profile.id
    },
    function (err, customer) {
      // no customer was found, lets create a new one
      if (!customer) {
        console.log(profile);
        var newCustomer = new that({
          facebookProviderId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.photos[0].value,
          comments: [],
          my_favorite_trucks: []
        });

        newCustomer.save(function (error, savedcustomer) {
          if (error) {
            console.log(error);
          }
          return cb(error, savedcustomer);
        });
      } else {
        return cb(err, customer);
      }
    }
  );
};

var Customer = mongoose.model("Customer", CustomerSchema);

module.exports = { Customer };
