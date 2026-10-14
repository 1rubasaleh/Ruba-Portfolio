const assert = require("node:assert/strict");
const test = require("node:test");

const runQuery = require("../src/config/query");

test("runs the PostgreSQL query with ordered parameter values", async () => {
  const expectedRows = [{ ProjectId: 7 }];
  let receivedQuery;
  let receivedParameters;
  const pool = {
    provider: "postgres",
    async query(query, parameters) {
      receivedQuery = query;
      receivedParameters = parameters;
      return { rows: expectedRows };
    },
  };

  const result = await runQuery(
    pool,
    "SELECT ProjectId FROM portfolio.Projects WHERE ProjectId = @id",
    'SELECT "ProjectId" FROM portfolio."Projects" WHERE "ProjectId" = $1',
    { id: 7 },
  );

  assert.equal(
    receivedQuery,
    'SELECT "ProjectId" FROM portfolio."Projects" WHERE "ProjectId" = $1',
  );
  assert.deepEqual(receivedParameters, [7]);
  assert.deepEqual(result.recordset, expectedRows);
});

test("runs the SQL Server query with named parameter values", async () => {
  const expectedRows = [{ ProjectId: 7 }];
  const receivedParameters = {};
  let receivedQuery;
  const request = {
    input(name, value) {
      receivedParameters[name] = value;
      return this;
    },
    async query(query) {
      receivedQuery = query;
      return { recordset: expectedRows };
    },
  };
  const pool = {
    provider: "sqlserver",
    request() {
      return request;
    },
  };

  const result = await runQuery(
    pool,
    "SELECT ProjectId FROM portfolio.Projects WHERE ProjectId = @id",
    'SELECT "ProjectId" FROM portfolio."Projects" WHERE "ProjectId" = $1',
    { id: 7 },
  );

  assert.equal(
    receivedQuery,
    "SELECT ProjectId FROM portfolio.Projects WHERE ProjectId = @id",
  );
  assert.deepEqual(receivedParameters, { id: 7 });
  assert.deepEqual(result.recordset, expectedRows);
});
