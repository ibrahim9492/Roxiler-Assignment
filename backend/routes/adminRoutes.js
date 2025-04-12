const express = require("express");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");
const { User, Store, Rating } = require("../models");

const router = express.Router();

// Admin Dashboard Stats
router.get(
  "/dashboard",
  authenticateUser,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const totalUsers = await User.count();
      const totalStores = await Store.count();
      const totalRatings = await Rating.count();

      res.json({ totalUsers, totalStores, totalRatings });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Add new user (Admin/Normal User/Store Owner)
router.post(
  "/users",
  authenticateUser,
  authorizeRole(["admin"]),
  async (req, res) => {
    const { name, email, password, address, role } = req.body;

    try {
      const newUser = await User.create({
        name,
        email,
        password, // No need to hash the password here
        address,
        role,
      });

      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// ✅ Add new store
router.post(
  "/stores",
  authenticateUser,
  authorizeRole(["admin"]),
  async (req, res) => {
    const { name, email, address, ownerId } = req.body;

    try {
      const newStore = await Store.create({ name, email, address, ownerId });
      res.status(201).json(newStore);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// View all users with filtering (by Name, Email, Address, Role)
router.get(
  "/users",
  authenticateUser,
  authorizeRole(["admin"]),
  async (req, res) => {
    const { name, email, address, role } = req.query;
    const filter = {};

    if (name) filter.name = { [Op.iLike]: `%${name}%` };
    if (email) filter.email = { [Op.iLike]: `%${email}%` };
    if (address) filter.address = { [Op.iLike]: `%${address}%` };
    if (role) filter.role = role;

    try {
      const users = await User.findAll({ where: filter });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// View all stores with filtering (by Name, Email, Address)
router.get(
  "/stores",
  authenticateUser,
  authorizeRole(["admin"]),
  async (req, res) => {
    const { name, email, address } = req.query;
    const filter = {};

    if (name) filter.name = { [Op.iLike]: `%${name}%` };
    if (email) filter.email = { [Op.iLike]: `%${email}%` };
    if (address) filter.address = { [Op.iLike]: `%${address}%` };

    try {
      const stores = await Store.findAll({
        where: filter,
        include: [{ model: Rating, attributes: ["value"] }],
      });

      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// View user details
router.get(
  "/users/:id",
  authenticateUser,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [{ model: Store, attributes: ["name"] }],
      });

      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

module.exports = router;
