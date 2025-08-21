// Aim - putting all "/listings" routes in this file inspite of app.js  

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

//app.get("/Listing", async (req, res) => { ... })      step - 5
router.get(     
  "/", // if you call this url "/listings" ya necha wala step perform karega, common parts have been removed. 
  async (req, res) => {
    const allListings = await Listing.find({}); // DB se saare listings allListings meh load ho gaya
    res.render("listings/index.ejs", { allListings }); // ejecting allListings in .ejs and render kr dega. 
  }
);
//---


// step - 7 aim: creating new listing by user and jo detail aya uska link ko main page per display krna. 
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});
//---


//step - 6.     aim: after clicking on anker tag in views/listings/index.ejs. it should show detail of that image.     
router.get("/:id", async(req, res)=>{// Matching ke time  path ka pattern same hai ya nahi yahi check hota hai.
  let { id } = req.params; // req.params se URL ke :id ka value nikala ja raha hai.
  const listing = await Listing.findById(id);   // Listing :- ya DB hai, listing:- ak single listing hai
  res.render("listings/show.ejs", { listing }); // 
});
//---


// step - 7 aim:  jo detail aya form(listings/new.ejs) k url (action="/listings") seh , save it in DB. 
router.post("/",wrapAsync( async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings"); // step - 11 : Adding server side validation, (wrapAsync)
} 
));
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
router.get("/:id/edit",async (req, res) => { // views/show.ejs k anker tag seh yaha request ayaga. 
    let { id } = req.params;
    const listing = await Listing.findById(id); // Listing DB meh jo id aya usko search karaga and uska sara detail store kr raha
    res.render("listings/editUpdate.ejs", { listing }); // sara detail eject kr ka show kr raha hai,  
  }
);

        // update route
router.put("/:id",async(req, res)=>{
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect("/listings"); //   redirect kiya hai Route No: 3 per
}); 
       // Delete 
router.delete("/:id",async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");}
);
//--


module.exports = router;

