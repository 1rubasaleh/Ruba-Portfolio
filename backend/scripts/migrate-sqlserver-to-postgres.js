const fs = require("node:fs/promises");
const path = require("node:path");
const { Pool } = require("pg");
const connectDB = require("../src/config/db");

const tables = [
  ["Roles", ["RoleId", "RoleName"]],
  ["SkillCategories", ["CategoryId", "CategoryName"]],
  ["Projects", [
    "ProjectId",
    "Title",
    "Description",
    "ImageUrl",
    "GitHubUrl",
    "LiveUrl",
    "CreatedAt",
  ]],
  ["Users", ["UserId", "Name", "Email", "PasswordHash", "RoleId", "CreatedAt"]],
  ["Profiles", [
    "ProfileId",
    "UserId",
    "FullName",
    "Title",
    "Bio",
    "ImageUrl",
    "Location",
    "CvUrl",
  ]],
  ["Skills", ["SkillId", "Name", "IconUrl", "CategoryId"]],
  ["ProjectSkills", ["ProjectId", "SkillId"]],
  ["Favorites", ["UserId", "ProjectId", "CreatedAt"]],
  ["Educations", [
    "EducationId",
    "ProfileId",
    "Institution",
    "Degree",
    "FieldOfStudy",
    "StartDate",
    "EndDate",
    "Description",
  ]],
  ["Experiences", [
    "ExperienceId",
    "ProfileId",
    "CompanyName",
    "Position",
    "StartDate",
    "EndDate",
    "Description",
  ]],
  ["Messages", [
    "MessageId",
    "Name",
    "Email",
    "Subject",
    "Content",
    "IsRead",
    "CreatedAt",
  ]],
];

const identityTables = [
  ["Roles", "RoleId"],
  ["SkillCategories", "CategoryId"],
  ["Projects", "ProjectId"],
  ["Users", "UserId"],
  ["Profiles", "ProfileId"],
  ["Skills", "SkillId"],
  ["Educations", "EducationId"],
  ["Experiences", "ExperienceId"],
  ["Messages", "MessageId"],
];

const run = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("Set DATABASE_URL to the target PostgreSQL connection string.");
  }

  const source = await connectDB();
  if (source.provider !== "sqlserver") {
    await source.end?.();
    await source.close?.();
    throw new Error("Run this migration from a machine connected to the source SQL Server.");
  }

  const target = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true },
  });
  let client;
  let transactionStarted = false;

  try {
    client = await target.connect();
    await client.query("BEGIN");
    transactionStarted = true;
    const schema = await fs.readFile(
      path.join(__dirname, "postgres-schema.sql"),
      "utf8",
    );
    await client.query(schema);

    for (const [table] of tables) {
      const result = await client.query(
        `SELECT COUNT(*)::integer AS count FROM portfolio."${table}"`,
      );
      if (result.rows[0].count > 0) {
        throw new Error(
          `Target table portfolio.${table} is not empty; refusing to overwrite or duplicate data.`,
        );
      }
    }

    for (const [table, columns] of tables) {
      const sourceRows = await source
        .request()
        .query(`SELECT * FROM portfolio.${table}`);
      const columnNames = columns.map((column) => `"${column}"`).join(", ");
      const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");

      for (const row of sourceRows.recordset) {
        const values = columns.map((column) => row[column]);
        await client.query(
          `INSERT INTO portfolio."${table}" (${columnNames}) VALUES (${placeholders})`,
          values,
        );
      }

      console.log(`Migrated ${table}: ${sourceRows.recordset.length} rows`);
    }

    for (const [table, column] of identityTables) {
      await client.query(
        `
          SELECT setval(
            pg_get_serial_sequence($1, $2),
            COALESCE(MAX("${column}"), 1),
            COUNT(*) > 0
          )
          FROM portfolio."${table}"
        `,
        [`portfolio."${table}"`, column],
      );
    }

    await client.query("COMMIT");
    transactionStarted = false;
    console.log("SQL Server data migrated successfully to PostgreSQL.");
  } catch (error) {
    if (transactionStarted) {
      await client.query("ROLLBACK");
    }
    throw error;
  } finally {
    client?.release();
    await target.end();
    await source.close();
  }
};

run().catch((error) => {
  console.error("Database migration failed:", error.message);
  process.exitCode = 1;
});
