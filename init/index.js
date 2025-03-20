const mongoose=require("mongoose");

const initData=require("./data.js");

const Listing=require("../Models/listing.js");
DB_url="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(DB_url);
}
const initDB=async()=>{
    await Listing.deleteMany({},{runValidators:true});
    initData.data=initData.data.map((obj)=>({...obj,
        owner:"67d30aede1dfec8bc1c34d34",
    }))
    await Listing.insertMany(initData.data);
    console.log("Data is initialized");
}
initDB();