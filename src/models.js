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

sequelize.drop();
console.log("kascnkasjdn");

async function deleteAllTablesExecptDataTable() {
  const [results] = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' -- 'public' is the default schema in PostgreSQL, adjust if needed
        AND table_type = 'BASE TABLE';
    `);
  let tableNames = results.map((result) => result.table_name);

  for (let tableName of tableNames) {
    if (tableName !== "DataTable") {
      await sequelize.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE;`);
    }
  }
}

async function clearData() {
  try {
    await DataTable.destroy({
      where: {}, // This empty object will match all records in the table
      truncate: true, // Use `truncate` to remove all rows efficiently
    });
    console.log("DATA CLEARED SUCCESSFULLY", "\n");
  } catch (err) {
    console.error("ERROR CLEARING DATA: ", err);
  }
}

module.exports = TokenModel;
