const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js"); 

const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");

const ListingController=require("../controllers/listings.js");

const multer  = require('multer');
const {storage}=require("../cloudConfig");
const upload = multer({storage});

router.route("/")
//Listing render Route
  .get(wrapAsync(ListingController.index))
//Create Route
.post(
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(ListingController.createListing),
)
  // .post(upload.single("listing[image"),(req,res)=>{
  //   res.send(req.file);
  // })

//new router
router.get("/new",isLoggedIn,ListingController.renderNewForm); 

router.route("/:id")
 //Show Route
.get(wrapAsync(ListingController.showListing))
//update route
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(ListingController.updateListing))
//delete route
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.destroyListing)
);

//Index Route
router.get("/",wrapAsync(ListingController.index));
  
  
  //Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.rendereditForm));

  module.exports =router;