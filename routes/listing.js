// Aim - putting all "/listings" routes in this file inspite of app.js
const ExpressError = require("../utils/ExpressError.js");

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js"); // joi server side validation
const { isLoggedIn, isOwner } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js"); // step: 20
const upload = multer({ storage });

// step: 12 middleMalwere for server side validation (Listingschema and joi ko use kr k validate karega ya middlewere)
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
//---

//app.get("/Listing", async (req, res) => { ... })      step - 5
router.get(
  "/", // if you call this url "/listings" ya necha wala step perform karega, common parts have been removed.
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}); // DB se saare listings allListings meh load ho gaya
    res.render("listings/index.ejs", { allListings }); // ejecting allListings in .ejs and render kr dega.
  })
);
//---

// step - 7 aim: creating new listing by user and jo detail aya uska link ko main page per display krna.
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});
//---

//step - 6.  (show route)   aim: after clicking on anker tag in views/listings/index.ejs. it should show detail of that image.
router.get(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    // Matching ke time  path ka pattern same hai ya nahi yahi check hota hai.
    let { id } = req.params; // req.params se URL ke :id ka value nikala ja raha hai.
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } }) // step:19, work: user ka naam v review meh dikhna caheya.
      .populate("owner"); // Listing :- ya DB hai, listing:- ak single listing hai
    if (!listing) {
      // error handling for deleted listings
      req.flash("error", "listing does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing }); //
  })
);
// populate("reviews"); ya use karoga tabhi reviews dikhaga otherwise nahi.
//.populate("reviews") → sirf review ke IDs ko actual review ke documents me badal deta hai.
//---

// step - 7 aim:  jo detail aya form(listings/new.ejs) k url (action="/listings") seh , save it in DB.
router.post(
  "/",
  isLoggedIn,
  validateListing, // step: 12 - implimented middlemalwere for server side validation
  upload.single("listing[image]"), // <!--Step: 20, aim: image upload, work: route restructuring-->
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);

    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename };
    // const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // step;19, aim:  work: jb v ak new user create krta ho uska user name v create karo
    await newListing.save();
    req.flash("success", "New Listing created"); // step- 14a
    res.redirect("/listings"); // step - 11 : Adding server side validation, (wrapAsync)
  })

  // (req, res) => {
  //   res.send(req.file);
  // }
);
/*  
req.body = { 
  listing: {
    title: "Taj Mahal",
    price: 2000
  }
}
*/
//---

// Step - 8: aim: Edit , Update and Delet any individual listing. (ya edit route hai)
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    // views/show.ejs k anker tag seh yaha request ayaga.
    let { id } = req.params;
    const listing = await Listing.findById(id); // Listing DB meh jo id aya usko search karaga and uska sara detail store kr raha
    res.render("listings/editUpdate.ejs", { listing }); // sara detail eject kr ka show kr raha hai,
  })
);

// update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"), // <!--Step 20, aim: upload image, work: jo image upload kr diya hu usko new image seh replace krna-->
  validateListing, // step: 12 - implimented middlemalwere for server side validation
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // step: 20, aim: upload image
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }
    //---
    req.flash("success", "Listing Updated");
    res.redirect("/listings"); //   redirect kiya hai Route No: 3 per
  })
);

// Delete
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "New Listing Deleted"); // step- 14a
    res.redirect("/listings");
  })
);
//--

module.exports = router;

/*

*> User form submit karta hai → /listings POST request jaata hai.

*> Server req.flash("success", "New Listing created") set karta hai aur redirect /listings kar deta hai.

*> Jab /listings GET request aata hai:

*> Middleware chalke res.locals.success = req.flash("success") set kar deta hai.
Ab success = ["New Listing created"] hoga.

*> listings/index.ejs render hota hai aur <%= success %> me "New Listing created" print ho jaata hai.

*/
