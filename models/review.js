// step: 13 - writing schema for review model

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating:{
        type: Number,
        min: 1,
        max: 5
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    // step: 19, work: review ko uska author hi delete ya edit kr shakta hai. 
    author:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
    //---
});

module.exports = mongoose.model("Review", reviewSchema); // "Review" → Model ka naam.
// Mongoose DB me collection ka naam banayega: reviews (lowercase + plural automatically).

