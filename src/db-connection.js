const { Sequelize } = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

authenticateConnection()
  .then(() => {
    syncSequelize();
  })
  .then(() => {
    sequelize.drop();
  })
  .catch((error) => {
    console.log(`ERROR WHILE APPLYING DATA OPERATIONS: ${error}`);
  });

async function authenticateConnection() {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error(`ERROR WHILE AUTHENTICATING DB CONNCETION: ${error}`);
  }
}

async function syncSequelize() {
  try {
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error(`ERROR WHILE SYNCING SEQUELIZE: ${error}`);
  }
}

module.exports = sequelize;
