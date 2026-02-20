const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: String,
  subjectCode: String,
  semester: String,
  professor: String,
  fileUrl: String,
  fileType: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["Pending", "Approved"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resource", resourceSchema);