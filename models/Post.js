const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users", //reference the users model
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  like: [
    {
      //includes objects with users defined so that each user can only like once (note: this is just extra info for functionality to be included somewhere else)
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],

  comments: [
    {
      //includes objects with users defined so that each user can only like once (note: this is just extra info for functionality to be included somewhere else)
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = mongoose.model("post", Post);
