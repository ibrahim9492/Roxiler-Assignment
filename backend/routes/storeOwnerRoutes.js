const express = require("express");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");
const { Store, Rating, User } = require("../models");

const router = express.Router();

// ✅ View ratings for their store
router.get(
  "/ratings",
  authenticateUser,
  authorizeRole(["store_owner"]),
  async (req, res) => {
    try {
      const store = await Store.findOne({ where: { ownerId: req.user.id } });
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }

      const ratings = await Rating.findAll({
        where: { storeId: store.id },
        include: [{ model: User, attributes: ["name", "email"] }],
      });

      res.json(ratings);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// ✅ Get store's average rating
router.get(
  "/average-rating",
  authenticateUser,
  authorizeRole(["store_owner"]),
  async (req, res) => {
    try {
      const store = await Store.findOne({ where: { ownerId: req.user.id } });
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }

      const ratings = await Rating.findAll({ where: { storeId: store.id } });
      const averageRating =
        ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length || 0;

      res.json({ averageRating });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

module.exports = router;
