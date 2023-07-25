const { DataTypes } = require("sequelize");
const sequelize = require("./db-connection");

const TokenModel = sequelize.define(
  "tokens",
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    tableName: "tokens",
    timestamps: false,
  }
);

module.exports = TokenModel;
