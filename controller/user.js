const User=require("../models/user.js");

module.exports.renderSignupform=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    let newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err) {return next(err);}
         req.flash("success","Welcome to Wanderlust");
         res.redirect("/listings");
    });
    }
    catch(err){
        req.flash("error",err.message);//erro ko alag page pei na dikha ke same page pei lfash krwaa diya like agr same username ho  and all error
        res.redirect("/signup");
    }
}

module.exports.renderLoginform=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome Back To wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";//meabs agr new wale page se loginki request gyi hogi toh apne ismei value aajygi wrna /listings wale page pei login ke baad chla jayega user
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
             return next(err);
        }
    req.flash("success","Logged out");
    res.redirect("/listings");
    });
}