const Listing=require("../models/listing.js");
const Review=require("../models/review.js");


module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);//woh hotel nikal liyajismei yeh reiew add krna hai
    let newReview=new Review(req.body.review);//kyunkiaad kro review[rating],review[comment]

    newReview.author=req.user._id;//means uske author mei curruser ki id ko daal diya 
    await listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
     req.flash("success","new review added successfully");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//means listing mei jai us pei jiski id di hai usse update kro using pull and reiew wale array pei jao or jis review ke sath id match ho uss review ko hta fdo
    await Review.findByIdAndDelete(reviewId);//yeh toh hogya reviews collectoins e hatanaa

     req.flash("success","review deleted successfully");
    res.redirect(`/listings/${id}`);
}