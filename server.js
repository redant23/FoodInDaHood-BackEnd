const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const test = require("./routes/test");

const vendorSignup = require("./routes/vendor-signup");
const vendorlist = require("./routes/vendorlist");
const vendorSearch = require("./routes/vendor-search");
const facebookLogin = require("./routes/facebook-login");

const { mongoose } = require("./db/mongoose");
const passport = require("passport");
const path = require("path");
const app = express();
app.options("*", cors());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require("./passport.js")(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", test);
app.use("/api", vendorSignup);
app.use("/api", vendorlist);
app.use("/api", vendorSearch);

app.use("/api", facebookLogin);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});
