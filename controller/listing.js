const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');//bhaiut saari service mei se geocodeing ko use kiya   (cpoy from documentation)
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index=async (req,res)=>{
    const allisting=await Listing.find({});
    res.render("listings/index.ejs",{allisting});//kyunki abbb views ke andar listing mei hai by default express view ko dkehta hai
}

module.exports.rendernewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.createListing=async (req,res,next)=>{
    //method 1
    // let {title:t,description:d,image:i,price:p,location:l,country:c}=req.body;
    // let data=await Listing.insertOne({title:t,description:d,image:i,price:p,location:l,country:c});

    //method2
        // if(!req.body.listing){
        //     throw new ExpressError(400,"Send valid data for listing");//manlo hopscth se direct popst pei request bhjdi toh vhan toh data eneter hi ni hua tooh req.body.listing mei kuch nhi hoga toh yeh chelga 
        // }
        // let result= listingSchema.validate(req.body);
        // if(result.error){
        //     throw new ExpressError(400,result.error);
        // } iski jagab abb middle ware function bna liya

   let response=await geocodingClient.forwardGeocode({
     query:req.body.listing.location,//means uss location ke coordinate lene ke liye
    limit:1,
    })
    .send()
    let url=req.file.path;//url ko fetch krliye cloudinary wale ko
    let filename=req.file.filename;
    console.group(url,"..",filename);
     const newListing=new Listing(req.body.listing);
     newListing.owner=req.user._id;//means new lsiting mei current login user ki id save krwadi taaki aage jo fomamei data hai ussi mei jaaye or owner ka name prin tho ske  
     newListing.image={url,filename};//taaki database mei url and filename bhi save ho skein
    newListing.geometry=response.body.features[0].geometry;
     let savedlisting=await newListing.save();
     console.log(savedlisting);
    req.flash("success","New Listing added successfully");//flash message add krne ke liye jbb bhinew list add ho
    res.redirect("/listings");

}


module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");//owner ki details ke liye .opulate(owner) krwya
    //yeh hai error flash krwad ke liye ki listing eist hi ni krti
    if(!listing){
        req.flash("error","Listing donot exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.rendereditForm=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    //same yhaan pei error flash krwane ke liye ki listing exist hi ni krtii yeh wali
    if(!listing){
        req.flash("error","Listing donot exist");
        return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
   originalImageUrl =originalImageUrl.replace("/upload","/upload/h_300/w_250");//yeh uplaod ki jagah hume ye nyi chiz add kdiya yeh cloud ka functino hota hai pixel girane ka
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    //yeh ab ek array agya
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save(); 
    }
     req.flash("success"," Listing updated successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","List deleted succesfully");
    res.redirect(`/listings`);
}