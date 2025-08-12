const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


// Establishing connection to Data base ---> (Step-3)
const MONGO_URL = "mongodb://127.0.0.1:27017/PracWonderlust"; 
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main(){   
   await mongoose.connect(MONGO_URL);
}
//***


// Inserting Data into Data base  ---> (Step-4)
const initDB = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data); // line no: 2 dekho
    console.log("data has initialized");
}
initDB();
//***




/*

> command to save data into data base. 
* cd init
* node index.js   

*/