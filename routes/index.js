var express             = require("express");
var router              = express.Router();
var passport            = require("passport");
var LocalStrategy       = require("passport-local");//.Strategy;
var FacebookStrategy    = require("passport-facebook");//.Strategy;
var User                = require("../models/user");
var configAuth          = require("../config/auth.js");







//landing page
router.get("/",function(req, res){           
 res.render("landing");
});



//================
//   AUTH ROUTES
//================

// show register form

router.get("/register", function(req, res){
    
    res.render("register");

});

// handle signup logic

router.post("/register", function(req, res){
       
       var newUser = new User({username: req.body. , Email: req.body.Email});
       User.register(newUser, req.body.password, function(err, user){
            if(err) {
              console.log(err);              
              req.flash("error", err.message);
              return res.render("register");
            } 
        
        passport.authenticate("local")(req, res, function(){
        
          req.flash("success", "welcome to yehBOok " + user.username);
          res.redirect("/books");
        });


      });

});


//show login form

router.get("/login", function(req, res){
    res.render("login");
}); 

// handling login logic
router.post("/login", passport.authenticate("local",
 {
  successRedirect: "/books",
  failureRedirect: "/login"

}), function(req, res){


});


// logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out!!");
  res.redirect("/books");
});




function isLoggedIn(req, res, next)
{
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect("/login");
  }
}



module.exports  =  router;


