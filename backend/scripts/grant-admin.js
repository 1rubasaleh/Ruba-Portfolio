const sql = require("mssql/msnodesqlv8");
const connectDB = require("../src/config/db");

const email = process.argv[2]?.trim().toLowerCase();

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Usage: node --env-file=.env scripts/grant-admin.js <existing-account-email>");
  process.exitCode = 1;
} else {
  grantAdmin(email).catch((error) => {
    console.error("Admin role update failed:", error.message);
    process.exitCode = 1;
  });
}

async function grantAdmin(accountEmail) {
  const pool = await connectDB();
  const transaction = new sql.Transaction(pool);
  let transactionStarted = false;

  try {
    await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
    transactionStarted = true;

    const roleResult = await transaction
      .request()
      .input("roleName", "admin").query(`
        SELECT RoleId
        FROM portfolio.Roles WITH (UPDLOCK, HOLDLOCK)
        WHERE LOWER(LTRIM(RTRIM(RoleName))) = @roleName
      `);

    if (roleResult.recordset.length > 1) {
      throw new Error("Multiple admin roles exist; resolve duplicate role rows first.");
    }

    let adminRoleId = roleResult.recordset[0]?.RoleId;
    if (!adminRoleId) {
      const insertedRole = await transaction
        .request()
        .input("roleName", "admin")
        .query(`
          INSERT INTO portfolio.Roles (RoleName)
          OUTPUT INSERTED.RoleId
          VALUES (@roleName)
        `);
      adminRoleId = insertedRole.recordset[0].RoleId;
    }

    const userResult = await transaction
      .request()
      .input("email", accountEmail).query(`
        SELECT UserId
        FROM portfolio.Users WITH (UPDLOCK, HOLDLOCK)
        WHERE LOWER(LTRIM(RTRIM(Email))) = @email
      `);

    if (userResult.recordset.length !== 1) {
      throw new Error(
        userResult.recordset.length === 0
          ? "No existing account has that email. Register your account first."
          : "Multiple accounts have that email; resolve duplicate accounts first.",
      );
    }

    await transaction
      .request()
      .input("userId", userResult.recordset[0].UserId)
      .input("roleId", adminRoleId)
      .query(`
        UPDATE portfolio.Users
        SET RoleId = @roleId
        WHERE UserId = @userId
      `);

    await transaction.commit();
    transactionStarted = false;
    console.log("Admin role assigned to the existing account.");
  } catch (error) {
    if (transactionStarted) {
      await transaction.rollback();
    }
    throw error;
  } finally {
    await pool.close();
  }
}
