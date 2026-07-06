if(process.env.NODE_ENV!="production"){//means agr prodction mei hai yeh website toh yeh env file use nhi hogi agr development phase chl rh ahai tbb yeh use hogi 
    require("dotenv").config();
}
console.log(process.env.ATLASDB_URL);



const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./util/ExpressError.js");
const session=require("express-session");//session ko require kr liya(import)
const {MongoStore}=require('connect-mongo');
const flash=require("connect-flash");//flash ko import kr liya
const passport=require("passport");
const LocalStrategy = require("passport-local");
const User=require("./models/user.js"); 



//express router bna diye
const listingRouter=require("./routes/listings.js");
const reviewRouter=require("./routes/reviews.js");
const wrapAsync = require("./util/wrapAsync.js");
const userRouter=require("./routes/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

console.log(MongoStore);

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dburl=process.env.ATLASDB_URL


main()
.then((res)=>{console.log("connection succesfull")})
.catch((err)=>{console.log(err)});



async function main()
{
    await mongoose.connect(dburl)
}


let port=8080;

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("error in mongo store");
})

//session ka third step
const sessionOption={
    store,
    secret:process.env.SECRET  ,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expiry:Date.now() + 7*24*60*60*1000,//millisecondmei likhna hotahai mean aaj se 7 din baad yeh cookie delete hojegi
        maxAge:7*24*60*60*1000,
        httpOnly:true//yeh hacker se safety ke liye true rkhna hotahai
    }
}



app.use(session(sessionOption));//middleware hai seesioin ka
//flash ka middleware
app.use(flash());

//initialize krliya passport ko (humeaha session ke niche hi hoga)
app.use(passport.initialize());
app.use(passport.session());//yeh seesion tkk user ko ki login info store rkhta hai taaki baar baar login na krna pade

passport.use(new LocalStrategy(User.authenticate()));//use->taake hrr new user ke liye mer apura loogin/signup ayye then usse authenticate kre 
passport.serializeUser(User.serializeUser());//means sessionmei user ki detials add krna
passport.deserializeUser(User.deserializeUser());///means session end hone pei session se user ki detail htana


app.use((req,res,next)=>{
     res.locals.successMsg=req.flash("success");
     res.locals.errorMsg=req.flash("error");
     res.locals.currUser=req.user;
     next();
})

//ye model mei bhj rkhenge hain abb routes
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.get("/demo", async (req,res)=>{
//     try{
//         let fakeUser = new User({
//             email:"student@gmail.com",
//             username:"student123",
//         });

//         let registeredUser = await User.register(fakeUser,"helloworld");
//         res.send(registeredUser);

//     }catch(err){
//         console.log(err);
//         res.send(err.message);
//     }
// });






// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calngute,Goa",
//         country:"India"
//     })

//     await sampleListing.save();
//     console.log("sample save to database");
//     res.send("succesfull testing");
// });


app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found !"));
})

//custom error handler
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    //res.status(statusCode).send(message);
     res.status(statusCode).render("listings/error.ejs",{message});
})

app.listen(port,()=>{
    console.log(`server is listening port${port}`);
});