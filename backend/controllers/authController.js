const Student = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================
// REGISTER CONTROLLER
// =========================
exports.register = async (req, res) => {
  try {
    const { usn, name, semester, email, password, role } = req.body;

    if (!usn || !name || !semester || !email || !password || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await Student.findOne({
      $or: [{ usn }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      usn,
      name,
      semester,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      msg: "User registered successfully",
      user: {
        id: student._id,
        usn: student.usn,
        name: student.name,
        semester: student.semester,
        email: student.email,
        role: student.role
      }
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error during registration" });
  }
};

// =========================
// LOGIN CONTROLLER
// =========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: student._id,
        usn: student.usn,
        name: student.name,
        semester: student.semester,
        email: student.email,
        role: student.role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error during login" });
  }
};

// =========================
// GET CURRENT USER (/me)
// =========================
exports.getMe = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");

    if (!student) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(student);

  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ msg: "Server error while fetching user" });
  }
};