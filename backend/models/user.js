const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  usn: { type: String, unique: true, sparse: true },
  name: String,
  semester: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "faculty", "student"], default: "student" }
});

module.exports = mongoose.model("User", userSchema);