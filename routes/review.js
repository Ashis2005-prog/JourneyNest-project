const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js"); 
const expressError=require("../utils/expressError.js");

const {validateReviews, isLoggedIn, isReviewAuthor}=require("../middleware.js");

const reviewControllers=require("../controllers/reviews.js");

  
  
  //Reviews
  //POST review route
  router.post("/",isLoggedIn,validateReviews,wrapAsync(reviewControllers.createReview));
  //delete review route
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewControllers.destroyReview));

module.exports=router;
  