const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { usn, name, semester, email, password, role } = req.body;

  const existing = await User.findOne({ $or: [{ usn }, { email }] });
  if (existing) return res.status(400).json({ msg: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    usn,
    name,
    semester,
    email,
    password: hashed,
    role
  });

  res.json(user);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, user });
};