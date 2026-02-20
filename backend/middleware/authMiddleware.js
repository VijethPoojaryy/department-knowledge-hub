const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (roles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader)
        return res.status(401).json({ msg: "No token provided" });

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user)
        return res.status(401).json({ msg: "User not found" });

      // Role check
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ msg: "Access denied" });
      }

      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ msg: "Invalid token" });
    }
  };
};