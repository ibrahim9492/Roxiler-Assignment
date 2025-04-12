const { sequelize } = require("./models");

sequelize
  .sync({ force: false })
  .then(() => console.log("Database & tables created!"))
  .catch((err) => console.log("Error: ", err));
