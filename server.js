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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
app.use(bodyParser.text({ type: 'text/html' }))

app.options("*", cors());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require("./passport.js")(passport);


// // parse some custom thing into a Buffer


// // parse an HTML body into a string


app.use("/api", test);
app.use("/api", vendorSignup);
app.use("/api", vendorlist);
app.use("/api", vendorSearch);

app.use("/api", facebookLogin);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});
