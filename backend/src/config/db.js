const authMode =
  process.env.DB_AUTH_MODE ||
  (process.env.NODE_ENV === "production" ? "sql" : "windows");

const createDatabaseClient = () => {
  if (authMode === "postgres") {
    if (!process.env.DATABASE_URL) {
      throw new Error("PostgreSQL authentication requires DATABASE_URL.");
    }

    const { Pool } = require("pg");
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: true },
    });
    pool.provider = "postgres";
    return pool;
  }

  if (authMode === "sql") {
    const requiredSettings = ["DB_SERVER", "DB_NAME", "DB_USER", "DB_PASSWORD"];
    const missingSettings = requiredSettings.filter(
      (setting) => !process.env[setting],
    );

    if (missingSettings.length > 0) {
      throw new Error(
        `SQL authentication requires these environment settings: ${missingSettings.join(", ")}`,
      );
    }

    const sql = require("mssql");
    const config = {
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      options: {
        encrypt: true,
        trustServerCertificate: false,
      },
    };

    if (process.env.DB_PORT) {
      config.port = Number(process.env.DB_PORT);
    }

    return { sql, config };
  }

  if (authMode !== "windows") {
    throw new Error(
      "DB_AUTH_MODE must be 'windows', 'sql', or 'postgres'.",
    );
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("Windows authentication is not supported in production.");
  }

  const sql = require("mssql/msnodesqlv8");
  return {
    sql,
    config: {
      server: process.env.DB_SERVER || "RUBA_SALEH\\MSSQLSERVER08",
      database: process.env.DB_NAME || "RubaPortfolioDB",
      driver: "ODBC Driver 18 for SQL Server",
      options: {
        trustedConnection: true,
        trustServerCertificate: true,
      },
    },
  };
};

let postgresPool;

const connectDB = async () => {
  try {
    if (authMode === "postgres") {
      if (!postgresPool) {
        postgresPool = createDatabaseClient();
      }
      await postgresPool.query("SELECT 1");
      return postgresPool;
    }

    const { sql, config } = createDatabaseClient();
    const pool = await sql.connect(config);
    pool.provider = "sqlserver";

    console.log("Database connected successfully");

    return pool;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

module.exports = connectDB;
