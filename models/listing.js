// listing schema 
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
          : v,
    },
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
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});



const Listing = mongoose.model("Listing", listingSchema); // ("collection ka naam ", collection ka schema)
module.exports = Listing;
