const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const user = require("./user.js");
const { required, object } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description:{
    type:String,
    
  } ,
  image: {
    url:String,
    filename:String,
},
 
  price: {
    type:Number,
  },
  location: String,
  country: String,
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review",
  },
],
owner:{
  type:Schema.Types.ObjectId,
  ref:"User",
},
geometry:{
  type:{
    type: String,
    enum:['Point'],
    required:true
  },
coordinates:{
  type:[Number],
  required:true
}
},
category:{
  type:String,
  enum:["Bnb-City",
"Bnb-Hospitals","Bnb-Rooms","Bnb-Ships","Bnb-Hills",
"Bnb-Rubs","Bnb-Shops","Bnb-Flair","Bnb-Filter"]
}
});

listingSchema.post("findOneAndDelete" , async (listing) =>{
  if (listing){
    await Review.deleteMany({_id: { $in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
