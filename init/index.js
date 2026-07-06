const mongoose= require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
.then((res)=>{console.log("connection succesfull")})
.catch((err)=>{console.log(err)});



async function main()
{
    await mongoose.connect(MONGO_URL)
}

async function initDB(){
    await Listing.deleteMany({});//phle humne apna databse clean kridy aagr kuch usmei dat pdah tha to
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"6a4766cdd184e3655970384e"}));
    await Listing.insertMany(initdata.data);//humne apne sample data insert krdiya dot operation kyunku ii=nitdata apne app mei ek object hai
    console.log("data was intialized");
}

initDB();