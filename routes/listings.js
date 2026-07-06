const express=require("express");
const router=express.Router();
const wrapAsync=require("../util/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../util/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controller/listing.js");

const multer=require("multer");
const {storage}=require("../cloudCongfig.js");
const upload=multer({storage});//means multer abb file ko storage mie save krega that is cloudniary mei 

//using router.route() and combin i)index route and ii)update route --------.>>>>>>>
router.route("/")
      .get(wrapAsync(listingController.index))
       .post(upload.single('listing[image]'),validateListing,
            wrapAsync(listingController.createListing));
      

//iii)create & new route yeh upper hoga id wale se wrna (new) ko id manlega niche wla or isee chln nhi dega
router.get("/new",isLoggedIn,listingController.rendernewForm);
//update
// router.post("/",validateListing,wrapAsync(listingController.createListing)); //router.route() mei bhj diya   

router.route("/:id") //show,delte and update ko combine krdiya
        .get(wrapAsync(listingController.showListing))
        .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
        .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//i) Index route
// router.get("/",wrapAsync(listingController.index));  router.route mei bhj diya 





//ii)show route an individual
// router.get("/:id",wrapAsync(listingController.showListing));

//iv)edit and update
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.rendereditForm));
//updatw
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//(v) DELETE listing
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports=router;