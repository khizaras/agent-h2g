const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("hands2gether_dev", "root", null, {
  host: "127.0.0.1",
  dialect: "mysql",
});

(async () => {
  try {
    const [results] = await sequelize.query("DESCRIBE categories");
    console.log("Categories Table Schema:", results);
  } catch (error) {
    console.error("Error inspecting categories table:", error);
  } finally {
    await sequelize.close();
  }
})();
