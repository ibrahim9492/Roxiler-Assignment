const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require("../models");

dotenv.config();

const router = express.Router();

// User Signup
router.post(
  "/signup",
  [
    check("name").notEmpty().withMessage("Name is required."),
    check("email").isEmail().withMessage("Invalid email format."),
    check("password")
      .isLength({ min: 8, max: 16 })
      .matches(/[A-Z]/)
      .matches(/[!@#$%^&*]/)
      .withMessage(
        "Password must be 8-16 characters long, include one uppercase letter and one special character."
      ),
    check("address")
      .optional()
      .isLength({ max: 400 })
      .withMessage("Address must be less than 400 characters."),
    check("role")
      .isIn(["admin", "user", "store_owner"])
      .withMessage("Invalid role."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, address, role } = req.body;

    try {
      // ✅ Check if user exists
      if (await User.findOne({ where: { email } })) {
        return res.status(400).json({ message: "User already exists." });
      }

      // ✅ Create user (password hashing is handled in `User.js`)
      const user = await User.create({ name, email, password, address, role });

      // ✅ Generate JWT Token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// User Login
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Invalid email format."),
    check("password").notEmpty().withMessage("Password is required."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user)
        return res.status(400).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({ token, role: user.role, userId: user.id });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

module.exports = router;
