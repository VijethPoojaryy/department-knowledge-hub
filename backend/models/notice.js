const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: String,
  content: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notice", noticeSchema);