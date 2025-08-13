// Basic setup    --->  (Step-1)
const express = require("express");
const app = express();
const mongoose = require("mongoose"); 
//***


//aim: ejecting allListings in index.ejs   (step -- 5)
const path = require("path");
const listingsRoute = require("./routes/listing.js");
//---


// Establishing connection to Data base ---> (Step-2)
const MONGO_URL = "mongodb://127.0.0.1:27017/PracWonderlust";  
main().then(()=>{    //  calling main method  
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main(){   
   await mongoose.connect(MONGO_URL); 
}
//***

//aim: ejecting allListings in index.ejs   (step -- 5)
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views")); // //  sets the folder where Express should look for .ejs files.
app.use(express.urlencoded({ extended: true }));   
//---

app.get("/", (req, res) => {
  res.redirect("/listings"); // "/listings"  "Hi, I am root"
});

//jo ve request "/listings" url per ayaga redirect it to listingsRoute  (step -- 5)
app.use("/listings", listingsRoute);
//





app.listen(8080, () => {
  console.log("Listening to port 8080");
});