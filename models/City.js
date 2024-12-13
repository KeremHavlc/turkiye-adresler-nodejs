const mongoose = require("mongoose");

const citySchema = mongoose.Schema(
  {
    name: { type: String }, 
    districts: [
      {
        name: { type: String }, 
        neighborhoods: [
          {
            name: { type: String }, 
            neighborhood_id: { type: String }, 
          },
        ],
      },
    ],
  },
  { timestamps: true } 
);

const City = mongoose.model("City", citySchema);

module.exports = City;
