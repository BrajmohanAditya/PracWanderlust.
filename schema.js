
// step: 12 - using server side validation using joi, if someone tryes to add listing using Hopscoch and , kuch 
// detail nahi fill krta hai toh ab usko error dikhaga or wo add nahi kr payaga bina iska add kr deta. 

const Joi = require("joi");
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0), // ✅ price as number
    image: Joi.object({
      url: Joi.string().allow("").uri(), // ✅ blank bhi chalega
      filename: Joi.string().allow(""), // ✅ blank bhi chalega
    })
  }).required(),
});

// step: 13 implementing serverside validation (joi schema)
module.exports.reviewSchema = Joi.object({ 
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
  }).required(),
});
//--
