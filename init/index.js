require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Establishing connection to Data base ---> (Step-3)
// const MONGO_URL = "mongodb://127.0.0.1:27017/PracWonderlust";
const MONGO_URL = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}
//***

// Inserting Data into Data base  ---> (Step-4)
const initDB = async () => {
  await Listing.deleteMany({});
  //step: 19, aim: implementing authorization, work: adding owner to every listing
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68bbc771a24561acf523b6f8",
  }));
  //---
  await Listing.insertMany(initData.data); // line no: 2 dekho
  console.log("data has initialized");
};
initDB();
//***

/*

> command to save data into data base. 
* cd init
* node index.js   

*/
