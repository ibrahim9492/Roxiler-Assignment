const express = require("express");
const bcrypt = require("bcryptjs");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");
const { User, Store, Rating } = require("../models");
const { Op } = require("sequelize");

const router = express.Router();

// ✅ View all stores with search
router.get("/stores", authenticateUser, async (req, res) => {
  const { name, address } = req.query;
  const filter = {};

  if (name) filter.name = { [Op.iLike]: `%${name}%` };
  if (address) filter.address = { [Op.iLike]: `%${address}%` };

  try {
    let stores;
    if (req.user.role === "store_owner") {
      // Store owner can only see their own stores
      stores = await Store.findAll({
        where: { ...filter, ownerId: req.user.id },
        include: [{ model: Rating, attributes: ["value"] }],
      });
    } else {
      // Users can see all stores
      stores = await Store.findAll({
        where: filter,
        include: [{ model: Rating, attributes: ["value"] }],
      });
    }

    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Fetch store details
router.get(
  "/stores/:id",
  authenticateUser,
  authorizeRole(["user", "store_owner"]),
  async (req, res) => {
    try {
      const store = await Store.findByPk(req.params.id, {
        include: [{ model: Rating, attributes: ["value"] }],
      });

      if (!store) return res.status(404).json({ message: "Store not found" });

      const averageRating =
        store.Ratings.length > 0
          ? (
              store.Ratings.reduce((acc, r) => acc + r.value, 0) /
              store.Ratings.length
            ).toFixed(1)
          : null;

      res.json({ ...store.toJSON(), averageRating });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [{ model: Rating }],
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Allow access if user is store owner of this store OR a regular user
    if (
      req.user.role === "user" ||
      (req.user.role === "store_owner" && store.ownerId === req.user.id)
    ) {
      const averageRating =
        store.Ratings.length > 0
          ? (
              store.Ratings.reduce((acc, r) => acc + r.value, 0) /
              store.Ratings.length
            ).toFixed(1)
          : null;

      return res.json({ ...store.toJSON(), averageRating });
    }

    res.status(403).json({ message: "Unauthorized access" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Submit or update rating
router.post(
  "/ratings",
  authenticateUser,
  authorizeRole(["user"]),
  async (req, res) => {
    const { storeId, value } = req.body;

    try {
      let rating = await Rating.findOne({
        where: { storeId, userId: req.user.id },
      });

      if (rating) {
        rating.value = value;
        await rating.save();
      } else {
        rating = await Rating.create({ storeId, userId: req.user.id, value });
      }

      res.status(201).json(rating);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// ✅ Update password
router.put(
  "/update-password",
  authenticateUser,
  authorizeRole(["user", "store_owner", "admin"]),
  async (req, res) => {
    const { password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      req.user.password = hashedPassword;
      await req.user.save();

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

module.exports = router;
