// Basic setup    --->  (Step-1)
const express = require("express");
const app = express();
const mongoose = require("mongoose"); 
const path = require("path");
//***

//step - 9: aim: to create common navbar and footer
const ejsMate = require("ejs-mate");
app.use(express.static(path.join(__dirname, "/public"))); // css apply hoga 
// koi v request aya usko public folder acess krna ka permission ho. isi k liya ya middlemalware likha gaya hai.
// 

//aim: ejecting allListings in index.ejs   (step -- 5)
const listingsRoute = require("./routes/listing.js");
//---

// step: 8,  we cannot send PUT request in form, so use metovhoderide
const methodOverride = require("method-override"); // 
app.use(methodOverride("_method"));
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
/*
 step-5: local host meh jao or (http://localhost:8080/listings) ya type karo . you will get image and title. 
*/


//aim: ejecting allListings in index.ejs   (step -- 5)
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views")); // //  sets the folder where Express should look for .ejs files.
app.use(express.urlencoded({ extended: true }));   
//---

 
//step : 9 aim: to create common navbar, boilerplate and footer 
app.engine('ejs', ejsMate);
//


app.get("/", (req, res) => {
  res.redirect("/listings"); // "/listings"  "Hi, I am root"
});


//jo ve request "/listings" url per ayaga redirect it to listingsRoute  (step -- 5)
app.use("/listings", listingsRoute);
//



app.use((err, req, res, next) => {
  // step - 11 : Adding server side validation, error handling middle malware. 
  console.error(err.message);
  res.status(500).send("Something went wrong! " + err.message); // error handling middleware 
});



app.listen(3000, () => {
  console.log("Listening to port 3000");
});