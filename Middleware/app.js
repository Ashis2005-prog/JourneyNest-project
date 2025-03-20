const express=require("express");
const app=express();
const port=8080;
const ExpressError=require("./ExpressError");

// app.use("/",(req,res,next)=>{
//     console.log("I am 1st middleware");
//     next();
// });
//logger-morgan
// app.use("/random",(req,res,next)=>{
//     console.log("I am 2nd middleware");
//     console.log(req.method,req.path,req.hostname);
//     next();
// });
app.use("/api",(req,res,next)=>{
    let {token}=req.query;
    if(token==="giveaccess"){
        console.log("access paid");
        next();
    }
    // res.send("ACCESS DENIED");
    throw new ExpressError(401,"ACCESS DENIED");
})
// app.get("/api",(req,res)=>{
//     res.send("some data");
// })
// app.get("/",(req,res)=>{
//     res.send("Hi I am root");
// })
// app.use("/random",(err,req,res,next)=>{
// })
// app.get("/random",(req,res)=>{
//     abcd=abcd;
// })
app.get("/admin",(req,res)=>{
    throw new ExpressError(403,"Access to admin is forbidden");
})


app.listen(port,()=>{
    console.log(`app is listening through port ${port}`);
})