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


module.exports = router;