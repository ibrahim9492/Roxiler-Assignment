require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const storeOwnerRoutes = require("./routes/storeOwnerRoutes");
const { authenticateUser } = require("./middleware/authMiddleware");

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", authenticateUser, adminRoutes);
app.use("/api/user", authenticateUser, userRoutes);
app.use("/api/store-owner", authenticateUser, storeOwnerRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
