const user=require("../Models/user");

module.exports.rendersignUpForm=async(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new user({email,username});
        const registeredUser=await user.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","You successfully logged in");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm=async(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login= async(req,res)=>{
    // res.send("Welcome to Roomify , you are now logged in!");
    req.flash("success","Welcome back to JourneyNest");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=async(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You successfully logged out");
        res.redirect("/listings");
    })
}