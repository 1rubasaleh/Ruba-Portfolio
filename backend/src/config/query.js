const runQuery = async (
  pool,
  sqlServerQuery,
  postgresQuery,
  parameters = {},
) => {
  if (pool.provider === "postgres") {
    const result = await pool.query(postgresQuery, Object.values(parameters));
    return { recordset: result.rows };
  }

  const request = pool.request();
  for (const [name, value] of Object.entries(parameters)) {
    request.input(name, value);
  }

  return request.query(sqlServerQuery);
};

module.exports = runQuery;
