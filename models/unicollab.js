const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create a MongoDB Schema that can be accessed anywhere(by importing in another file/s )

const CollabSchema = new Schema({
  image: String,
  title: String,
  skills: String,
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  email: String,
  number: Number,
});

module.exports = mongoose.model("Collab", CollabSchema);
