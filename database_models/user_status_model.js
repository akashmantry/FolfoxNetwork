const mongoose = require("mongoose");
const shortid = require("shortid");
const moment = require("moment");

var commentSchema = mongoose.Schema({
  comment_email: {type: String, default: "None"},
  comment_status: {type: String, default: "None"},
  comment_name: {type: String, default: "None"},
  comment_profile_pic: {type: String, default: "None"},
  comment_status_date: {type: Date, default: Date.now},
  member_id: {type: String, default: "None"},
  status_id:{type: String, default: "None"},
  comment_id:{type: String, default: shortid.generate}
});

commentSchema.virtual("commentCreatedAt").get(function(){
  return moment(this.comment_status_date).fromNow();
});

var userStatusSchema = mongoose.Schema({
    user_email: String,
    user_status: String,
    name: String,
    profile_pic: String,
    status_date: {type: Date, default: Date.now},
    status_id:{type: String, default: shortid.generate},
    member_id:{type: String},
    likes: {type: Number, default: 0},
    comments: [commentSchema]
});

userStatusSchema.virtual("postCreatedAt").get(function(){
  return moment(this.status_date).fromNow();
});

var UserStatus = mongoose.model("UserStatus", userStatusSchema);

module.exports = UserStatus;
