const { DataTypes, DATE } = require("sequelize");
const sequelize = require("./db-connection");

const ClientsModel = sequelize.define(
  "clients",
  {
    cliendID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "clients",
    timestamps: false,
  }
);

const TokenModel = sequelize.define(
  "token",
  {
    tokenValue: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: null,
    },
    redeemed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "token",
    timestamps: false,
  }
);

ClientsModel.hasMany(TokenModel, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

TokenModel.belongsTo(ClientsModel, {
  foreignKey: {
    allowNull: false,
  },
});

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
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error(`ERROR WHILE SYNCING SEQUELIZE: ${error}`);
  }
}

module.exports = { ClientsModel, TokenModel };
