const express = require("express");
const router = express.Router();
const { Vendor } = require("../models/Vendors");
const vendors_samples = require("../db/vendor_samples.js");

router.get("/vendor/vendorlist", (req, res) => {
  function getDistanceFromLatLngInKm(lat1, lng1, lat2, lng2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLng = deg2rad(lng2 - lng1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    var result = d * 1000;
    return parseInt(result);
  }
  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }
  // 요청 기준 좌표 (default 바닐라코딩)
  var latTarget = req.query.lat;
  var lngTarget = req.query.lng;
  // 요청 거리 (default 1km)
  var distance = req.query.distance;
  // 요청 개수 
  var startIdx = req.query.startIdx;
  var endIdx = req.query.endIdx;

  Vendor.find().then((list) => {
    var filteredList = list.filter((item) => {
      var result = getDistanceFromLatLngInKm(latTarget, lngTarget, item.lat, item.lng);
      if (result < distance) {
        return item;
      }
    })
    filteredList.sort((a, b) => {
      return (
        getDistanceFromLatLngInKm(a.lat, a.lng, latTarget, lngTarget) -
        getDistanceFromLatLngInKm(b.lat, b.lng, latTarget, lngTarget)
      );
    });

    if (filteredList.length) {
      var vendorList = filteredList.slice(startIdx, endIdx);
      // renderList.forEach((item) => {
      //   console.log(getDistanceFromLatLngInKm(item.lat, item.lng, latTarget, lngTarget))
      // })
      res.json({ vendorList, total: filteredList.length });
    } else {
      res.json({ vendorList: filteredList, total: filteredList.length });
    }
  })

});

module.exports = router;




/*
 *   
 * var a = [];
  vendors_samples.vendors_sampledata.forEach((vendor, i) => {

    var sample = new Vendor(vendor);

    sample.save(function (err) {
      if (err) {
        console.log("msg : " + vendor.title + err);
      } else {
        a.push(i);
      }
      if (a.length === vendors_samples.vendors_sampledata.length) {
        res.send('success!');
      }
    })

  })
 * 
 */
