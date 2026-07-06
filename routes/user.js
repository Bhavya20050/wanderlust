const express=require("express");
const router=express.Router();
const User=require("../models/user");
const passport=require("passport");
const{saveRedirectUrl}=require("../middleware.js");

const userController=require("../controller/user.js");

//using router.route() and combing  same url wale 
router.route("/signup")
        .get(userController.renderSignupform)
        .post(userController.signup);

router.route("/login")
      .get(userController.renderLoginform)
        .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login)




//signup new user ke liye-->>
// router.get("/signup",userController.renderSignupform); //router.route mie bhj diyee

// router.post("/signup",userController.signup);

//login - old user ke liye-----.>>>>>
// router.get("/login",userController.renderLoginform); //rpouter.route() mie bhj idye
// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login)

//logut ->>>>>>>>>>>
router.get("/logout",userController.logout);

module.exports=router;