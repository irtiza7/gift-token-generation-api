const { DataTypes, Model } = require("sequelize");
const sequelize = require("./db-connection");

class TokenModel extends Model {}

// Model.init(attributes object, options object)
TokenModel.init(
  {
    tokenValue: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    validityDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    redeemedStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "token",
    timestamps: false,
  }
);

authenticateConnection()
  .then(() => {
    syncSequelize();
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
    await sequelize.sync({ alter: true, force: false });
  } catch (error) {
    console.error(`ERROR WHILE SYNCING SEQUELIZE: ${error}`);
  }
}

module.exports = { TokenModel, sequelize };
