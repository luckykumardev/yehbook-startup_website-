var express    = require("express");
var router     = express.Router();
var Book       = require("../models/book");
var middleware = require("../middleware");  // similar to var middleware = require("../middleware/index.js");  "it will take index.js file itself"



//INDEX-ROUTE  where we can se all books 
router.get("/", function(req, res){
    //Geting data from from mongodb 

    Book.find({}, function(err, allBooks){
         
        if(err){
        	console.log(err);  
        } else {
           
           res.render("books/index", {booksNAME:allBooks, currentUser: req.user}); // [books= it is arry or data we are passing]. ,
                                                                                   // [booksNAME= it is nothing but the name of our data
            }

    });
  
});

//CREATE- ROUTE adding data DB to "/books" route of new books
router.post("/", middleware.isLoggedIn, function(req, res){
//get data from form and add to books array
       
       var name        = req.body.name;
       var writer      = req.body.writer;
       var image       = req.body.image;
       var desc        = req.body.description;
       var author = {
        id: req.user._id,
        username: req.user.username
       }

       var newBooks    =                       //creating an object  "newBooks" for data coming from "new.ejs" templete 
                  
                  {
                         name        : name,
                         writer      : writer,
                         image       : image,
                         description : desc,
                        author        : author
                  }                              
    
       //create a new Book_detail and save it to DB
   Book.create(newBooks, function(err, newlyCreated){
            
            if(err){
            	console.log(err);
            } else {
                //redirect back to books page
              	res.redirect("/books");
        	
            }
    });    

        //books.push(newBooks);                //here we are pushing data in "books" array which is stored in "newBooks" object  
	});
//NEW-ROUTE creating details of new books
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("books/new");
});


//SHOW-ROUTE where we can see details of perticular book
router.get("/:id", function(req, res){
	//find the book with provided ID
Book.findById(req.params.id).populate("comments").exec(function(err, foundBook){  // "FindById()"  this function is inbult function in mongos we can easly use it to find Id of our data
	                                                                                //render show templete with that book
    if(err){
    	console.log(err);
    } else {
    	     //render show template with that perticular book
            res.render("books/show.ejs", {book: foundBook});
      }

   }); 

});

//EDIT BOOK ROUTE
router.get("/:id/edit", middleware.checkBookOwnership, function(req, res){
        
           Book.findById(req.params.id, function(err, foundBook){
           
            res.render("books/edit", {book: foundBook});


   });      
});


//UPDATE BOOK ROUTE

router.put("/:id", middleware.checkBookOwnership, function(req, res){
  // find and update the correct book
    
   Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook){       // findByIdAndUpdate() is a function from mongoose

     if(err) {
      res.redirect("/books");
     } else {
      // redirect somewhere(show page)
      
      res.redirect("/books/" + req.params.id);

     }

   });  

});

//DESTROY BOOK ROUTE..

router.delete("/:id", middleware.checkBookOwnership, function(req, res){

  Book.findByIdAndRemove(req.params.id, function(err){
     if(err){
      res.redirect("/books");
      
     } else {
      
      req.flash("success", "comment deleted");
      res.redirect("/books");
     }

  });
});

module.exports  =  router;