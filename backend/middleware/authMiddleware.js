const jwt = require("jsonwebtoken");
const { User } = require("../models");

// ✅ Middleware to Authenticate User
const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);

    if (!req.user) return res.status(404).json({ message: "User not found." });

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }
    res.status(400).json({ message: "Invalid token." });
  }
};

// ✅ Middleware for Role-Based Authorization
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden. You do not have access." });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRole };
