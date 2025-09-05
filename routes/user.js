// step-15, aim : signup user
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
  // work: form rendering
  res.render("users/signup.ejs");
});


// work: "saving data comming from signup.ejs"
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username }); // MongoDB ke users collection ka ek naya entry object banaya gaya hai, jo abhi DB me save nahi hua.
      const registeredUser = await User.register(newUser, password);
      // Now user will be automatically loged in after signup
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "signup successfully!");
        res.redirect("/listings");
      });
      //--
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);
//---

// step-15, aim : login user, work: form rendering
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});
//---

// step-15, aim : login user, work: "login.ejs" seh data receive kr k authenticate karega. fir login krna dega.
router.post(
  "/login",
  saveRedirectUrl, //step:18, work: login seh pahla jis url per jana hai usko save kra diya local meh
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "you are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings"; //  step: 18
    res.redirect(redirectUrl); //step:18, work: ab wo saved url per redirect kr diya.      
  }
);
//---

//logout user
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are loggedout");
    res.redirect("/listings");
  });
});
//--

module.exports = router;

/*
step: 18; suppose you hit add listing or ya validate karega "isLoggedIn" and , "isLoggedIn" middleMalwere chalaga, authenticate
karega ki tum login ho ya logout if logout then, wo malwere ka ander tum ush url ko define krta ho ,jaha tumha jana tha 
fir login page render kr deta hai fir , local meh wo url save kra deta hai. 

*/