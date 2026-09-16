const sql = require("mssql/msnodesqlv8");

const dbConfig = {
  server: "RUBA_SALEH\\MSSQLSERVER08",
  database: "RubaPortfolioDB",
  driver: "ODBC Driver 18 for SQL Server",
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

const connectDB = async () => {
  try {
    const pool = await sql.connect(dbConfig);

    console.log("Database connected successfully");

    return pool;
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

module.exports = connectDB;
