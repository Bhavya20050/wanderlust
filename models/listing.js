const mongoose=require("mongoose");
const Schema=mongoose.Schema;//schmea bna ke liye
const Review=require("./review.js")

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
       url:String,
       filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})//uss listing(hotel) ke review mei sirf review ki id hi hia isliye listing.reviews likha
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;