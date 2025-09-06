// listing schema 
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {

    url: String,
    filename:String,
  },

  price: {
    type: Number,
    required: true,
    default: 0,
  },
  location: String,
  country: String,
  reviews: [
    // step: 13 - reviews schema ko listing schema meh dala hu. ager tum show route meh log krta ho toh you will get detail and reviews of
    // that particular listing. 
    {
      type: Schema.Types.ObjectId,
      ref: "Review", // we wnt ki Listings meh vi review id store raha 
    },
  ],
  //step: 19, aim: implementing authorization, work: defining owner property
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  //---(jo listing ka owner hai wohi usko delete ya edit kr shakta hai). 
});

//step: 13-  ab mai chahta hu ki ager listing ko delet karu toh uska ander jo v reviews hai wo review schema seh v delet hona caheya  sb delet hona chaheya. 
listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
  }
});
//--

const Listing = mongoose.model("Listing", listingSchema); // ("collection ka naam ", collection ka schema)
module.exports = Listing;
