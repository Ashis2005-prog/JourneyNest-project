if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
  }
  
  const express = require("express");
  const app = express();
  const mongoose = require("mongoose");
  const Listing = require("./Models/listing.js");
  const path = require("path");
  const methodOverride = require("method-override");
  const ejsMate=require("ejs-mate");
  const colors=require("colors");
  const session=require("express-session");
  const MongoStore = require('connect-mongo');
  const flash=require("connect-flash");
  const passport=require("passport");
  const  localstrategy=require("passport-local");
  
  
  const user=require("./Models/user.js");
  
  
  const wrapAsync=require("./utils/wrapAsync.js"); 
  const expressError=require("./utils/expressError.js");
  const Review= require("./Models/reviews.js");
  const {listingSchema,reviewSchema}=require("./schema.js");
  const listingsRouter=require("./routes/listing.js");
  const reviewsRouter=require("./routes/review.js");
  const userRouter=require("./routes/user.js");
  
  // const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
  const dbUrl=process.env.ATLASDB_URL;
  main()
    .then(() => {
      console.log("connected to DB".white.bgCyan);
    })
    .catch((err) => {
      console.log(err);
    });
  
  async function main() {
    await mongoose.connect(dbUrl);
  }
  
  app.use((err,req,res,next)=>{ 
    console.log(err);
    let {statuscode=500,message="something went wrong"}=err; 
    res.render("listings/error.ejs",{message});
  })
  
  app.set("layout","layout/boilerplate");
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));
  app.engine('ejs',ejsMate);
  app.use(express.static(path.join(__dirname,"public")));
  
  const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
      secret:process.env.SECRET
    },
    touchAfter:24*3600
  });

  store.on("error",(err)=>{
    console.log("Error in mongo session store",err);
  })

  const sessionOptions={
    store,
      secret:process.env.SECRET,
      resave:false,
      saveUninitialized:true,
      Cookie:{
          expires:Date.now()+7*24*60*60*1000,
          maxAge:7*24*60*60*1000,
          httpOnly:true,
      }
  }

  
  app.use(session(sessionOptions));
  app.use(flash());
  
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new localstrategy(user.authenticate()));//authenticate the user
  
  passport.serializeUser(user.serializeUser());
  passport.deserializeUser(user.deserializeUser());
  
  
  
  app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
  });
  
  app.get("/demouser",async(req,res)=>{
    let fakeUser=({
      email:"example@getMaxListeners.com",
      username:"Demo123"
    });
    let registerUser=await user.register(fakeUser,"HelloWorld");
    res.send(registerUser);
  })
  
  
  app.use("/listings",listingsRouter);
  
  app.use("/listings/:id/reviews",reviewsRouter);
  app.use("/",userRouter);
  
  app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page not found"));
  })
  app.use((err,req,res,next)=>{
    console.log(err);
    
    let {statuscode=500,message="something went wrong"}=err;
    res.render("listings/error.ejs",{message});
  })
  app.listen(8080, () => {
    console.log("server is listening to port 8080".white.bgMagenta);
  });
  
  // app.get("/testListing", async (req, res) => {
  //   let sampleListing = new Listing({
  //     title: "My New Villa",
  //     description: "By the beach",
  //     price: 1200,
  //     location: "Calangute, Goa",
  //     country: "India",
  //   });
  
  //   await sampleListing.save();
  //   console.log("sample was saved");
  //   res.send("successful testing");
  // });