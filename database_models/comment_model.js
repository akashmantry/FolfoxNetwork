const mongoose = require("mongoose");
const shortid = require("shortid");

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

var CommentStatus = mongoose.model("CommentStatus", commentSchema);

module.exports = CommentStatus;
