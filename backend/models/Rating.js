const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Store = require("./Store");

const Rating = sequelize.define(
  "Rating",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Store,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

module.exports = Rating;
