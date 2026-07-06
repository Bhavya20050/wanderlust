const Listing=require("./models/listing");
const Review=require("./models/review");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./util/ExpressError.js");

module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;//bhai taki user nei jispei request bhi uska url store hojaye and then login hone ke baad ussi url pei chla jaaye
        req.flash("error","Please Login first");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{//yeh islioye bnanan pda kyu nki upper  pasport clear kr de rhA THA

    if(req.session.redirectUrl){
         res.locals.redirectUrl=req.session.redirectUrl;
    }
   next();
}

module.exports.isOwner=async(req,res,next)=>{
     let {id}=req.params;
    let listing=await Listing.findById(id);
    //yeh ab ek array agya
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not owner of this listing")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewauthor=async(req,res,next)=>{
     let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    //yeh ab ek array agya
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not author of this listing")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");//or simply write -> let errMsg=error
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}


module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");//or simply write -> let errMsg=error
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}