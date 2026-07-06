const express=require("express");
const router=express.Router({mergeParams:true});//mergeParams taki app.js se id review .js mei aa ske otherwise nhi ayegii
const wrapAsync=require("../util/wrapAsync.js");
const ExpressError=require("../util/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview,isLoggedIn,isReviewauthor}=require("../middleware.js");
const reviewController=require("../controller/review.js");


//post review route-->>
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewauthor,wrapAsync(reviewController.destroyReview));


module.exports=router;