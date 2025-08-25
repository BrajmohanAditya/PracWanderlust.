const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js"); // joi server side validation 
const Listing = require("../models/listing.js");

// step : 13 POST ROUTE 
router.post("/", async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();
    console.log("saved")
    res.send("saved");
})
//---



module.exports = router;
