const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js"); //step: 13 joi server side validation
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError");
const {
  isLoggedIn,
  isReviewAuthor,
  saveRedirectUrl,
} = require("../middleware.js");
// step : 13  joi server side validation (middlemalware)
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  //   console.log(result);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
//--

// step : 13 POST ROUTE, review dalna k bade jb submit karoga toh yahi route trigger hoga.
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    // validateReview is for serverside validation
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id; // step:19, work: user ka naam v review meh dikhna caheya.

    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Added"); // step- 14a

    res.redirect(`/listings/${listing._id}`); // ya listing  k show route ko trigger karega
  })
);
//---


// Step-13 delete route.   // (/listings/:id/reviews)
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async(req, res)=>{
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted"); // step- 14a

    res.redirect("/listings");
  })
)
//--
module.exports = router;
 