// Basic setup    --->  (Step-1)
require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

//---

//step - 9: aim: to create common navbar and footer
const ejsMate = require("ejs-mate");
app.use(express.static(path.join(__dirname, "/public"))); // css apply hoga
// koi v request aya usko public folder acess krna ka permission ho. isi k liya ya middlemalware likha gaya hai.
//---

// step: 15 aim: signup user. 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
//---
 

//step-14: Implementing session.(it will create session id in cookies , what you do on website will get store in session id)
const flash = require("connect-flash");
session = require("express-session"); 
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {  // session id ko itna din tak store kr k rakhaga. ab 1 week tak mera id password stored rahaga no need of re-login
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash()); 

// step-15, aim : signup user
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//---


// step-14a 
app.use((req, res, next) => {
  res.locals.success = req.flash("success");  // ya middlemalware hai. 
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // step:17, aim: if login show only logout, if logout show signup, login, work: variable define 
  next();
})
//--- * without session id you cannot create "flash"

//---


//aim: ejecting allListings in index.ejs   (step -- 5)
const listingsRoute = require("./routes/listing.js");
//---

const reviewRoute = require("./routes/review.js"); // step: 13

// step: 8,  we cannot send PUT request in form, so use metovhoderide
const methodOverride = require("method-override"); //
app.use(methodOverride("_method"));
//---

// Establishing connection to Data base ---> (Step-2)
// const MONGO_URL = "mongodb://127.0.0.1:27017/PracWonderlust";
const MONGO_URL = process.env.ATLASDB_URL;



main()
  .then(() => {
    //  calling main method
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}
/*
 step-5: local host meh jao or (http://localhost:8080/listings) ya type karo . you will get image and title. 
*/

//aim: ejecting allListings in index.ejs   (step -- 5)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // //  sets the folder where Express should look for .ejs files.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//---

//step : 9 aim: to create common navbar, boilerplate and footer
app.engine("ejs", ejsMate);
//
 



app.get("/", (req, res) => {
  res.redirect("/listings"); // "/listings"  "Hi, I am root"
});

//jo ve request "/listings" url per ayaga redirect it to listingsRoute  (step -- 5)
app.use("/listings", listingsRoute); // "listingsRoute"-  ya uper defined hai
//
app.use("/listings/:id/reviews", reviewRoute); //  step: 13 (review route ko redirect kr raha hu)

app.use("/", userRouter); // step: 15, aim:signup login logout, work: redirect. 

// step - 11 : Adding server side validation, # error handling middle malware.
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.render("error.ejs", { message });
  // res.status(statusCode).json({
  //   // step 13: bina ya line k hopscotch meh status ok nahi milaga.
  //   success: false,
  //   error: message,
  // });
}); // # jb koi error aya or koi route nahi work kara toh express khud hi ishko call kr deta hai or server crash nahi hota

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
   