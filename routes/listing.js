// Aim - putting all "/listings" routes in this file inspite of app.js  

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

//app.get("/Listing", async (req, res) => { ... })      step - 5
router.get(     
  "/", // if you call this url "/listings" ya necha wala step perform karega, common parts have been removed. 
  async (req, res) => {
    const allListings = await Listing.find({}); // database se saare listings allListings meh load ho gaya
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




module.exports = router;