const express=require("express");
const router=express.Router();
const user=require("../Models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");

const userControllers=require("../controllers/user.js");

router.route("/signup")
//render signup form route
.get(userControllers.rendersignUpForm)
//signup route
.post(wrapAsync(userControllers.signUp)
);

router.route("/login")
//render login form route
.get(userControllers.renderLoginForm)
//login route
.post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login',failureFlash:true}),userControllers.login);

router.get("/logout",userControllers.logout);

module.exports=router;