// middlemalwere for authentication and authorization
const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

//middlemalwere use it anywhere to authenticate ki user login hai ki nahi if no then usko add listing  krna mt doh.
module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; //step:18, work: Ye line ek bookmark banati hai ki user kahaan jaana chahta tha, taaki login ke baad usko wahi wapas bhej sakein.
    req.flash("error", "You must be loged in to do any thing");
    return res.redirect("/login");
  }
  next();
};
//*the moment you hit a url it generate, req,  (req) k ander sara detail hota hai, like path wagera(req.originalUrl). 
//---


//step:18, aim:  user jaha jaana chahta hai, login ke baad usko wahi wapas wohi send kr doh. 
module.exports.saveRedirectUrl = (req, res, next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
//--- work: Ye middleware session me rakhe huye redirectUrl ko locals me daal deta hai

//step: 19, work: if you are authorised user only then you could delete or edit listings
module.exports.isOwner = async(req, res, next)=>{
  let {id} = req.params; 
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error", "you don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
//---

module.exports.validateListing = (req, res, next)=>{
   let {error} = listingSchema.validate(req.body);
  //   console.log(result);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  //   console.log(result);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//step: 19, work: if you have created review only then you could delete it. 
module.exports.isReviewAuthor = async (req, res, next) => {
  let {id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the author of this review ");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
//---