var express             = require("express");
var app                 = express();
var bodyParser          = require("body-parser");
var mongoose            = require("mongoose");
var flash               = require("connect-flash");
var passport            = require("passport");
var LocalStrategy       = require("passport-local");//.Strategy;
var FacebookStrategy    = require("passport-facebook");//.Strategy;
var Book                = require("./models/book");
var seedDB              = require("./seeds.js"); // in lecture it is ".seed" only and it's not working here
var Comment             = require("./models/comment");
var User                = require("./models/user.js");
var methodOverride      = require("method-override");

var commentRoutes       = require("./routes/comments");
var booksRoutes         = require("./routes/books");
var indexRoutes         = require("./routes/index");
var configAuth          = require("./config/auth");


//--------------------------------------------------------------------------------------------------------------------------

mongoose.connect("mongodb://localhost/bitbuket");  // connecting with DB and creatind a DB(yeh_BOok) in mongodb

//mongoose.connect("mongodb://lucky_data_final:lucky12123@ds041566.mlab.com:41566/yehbook");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs"); 


app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//----------------------------------------------------------------------------------------------------------------------

// seedDB(); // seed the database

// PASSPORT CONFIGURATION

app.use(require("express-session")({
       
       secret:          "irodov",
       resave:           false,
       saveUnintialized: false

}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var FACEBOOK_APP_ID       =  '1804115569898807';
var FACEBOOK_APP_SECRET   =  '428a76af1b718852e1cead43cc19293c';

var fbOpts = {

   clientID: FACEBOOK_APP_ID,
   clientSecret: FACEBOOK_APP_SECRET,
   callbackURL: 'http://localhost:3000/login/auth/facebook/callback',
   profileField: ['emails']   

};
var fbCallback = function(accessToken, refreshToken, profile, cb){
  

  console.log(accessToken, refreshToken, profile.id,profile.displayName);
    



};
passport.use(new FacebookStrategy(fbOpts, fbCallback));


app.get("/login/auth/facebook", passport.authenticate('facebook', {scope: ['email']}));



app.get('/login/auth/facebook/callback', function (req, res, next) {
     var authenticator = passport.authenticate ('facebook', {
       successRedirect: req.session.returnTo,
       failureRedirect: '/'
      });
   




 var newUser = new User({username: profile.displayName, facebookId: profile.id});
       User.register(newUser, req.body.password, function(err, user){
            if(err) {
              console.log(err);              
              req.flash("error", err.message);
            //  return res.render("register");
            } 
        
        passport.authenticate("facebook")(req, res, function(){
        
          req.flash("success", "welcome to yehBOok " + user.username);
          res.redirect("/books");
        });


      });




    delete req.session.returnTo;
    authenticator (req, res, next);
    });
 // app.get("/login/auth/facebook/callback", passport.authenticate('facebook', function(err, user, info){
 // 	console.log(err, user, info);
 	
 // }));


app.use(function(req, res, next){
   res.locals.currentUser    = req.user;
   res.locals.error          = req.flash("error");
   res.locals.success        = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/books",booksRoutes);
app.use("/books/:id/comments",commentRoutes);


// app.listen(process.env.PORT,process.env.IP, function(){
  
//   console.log("SERVER IS STARTED");

// });




app.listen(3000, function(){
  
  console.log("SERVER IS STARTED");

});
