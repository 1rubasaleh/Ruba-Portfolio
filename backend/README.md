# Portfolio API: local setup and administrator access

## Registration and API connectivity

The Express API listens on port `5000` and exposes registration as
`POST /auth/register`. The JSON body is `{ "name", "email", "password" }`.
Registration assigns the existing `user` role in `portfolio.Roles`; role
information submitted by a browser is ignored.

For local development, run the API on the same machine as SQL Server:

```powershell
cd backend
npm start
```

The API waits for SQL Server and requires `JWT_SECRET` before it listens. For
local development, it can load these settings from the ignored `backend/.env`
file and use Windows authentication. Never commit database credentials or
local connection details.

For the free demo deployment, the API runs on Render and uses PostgreSQL on
Neon. The checked-in `render.yaml` selects Render's free Oregon service and
defines required secrets as unsynced values. Set `DATABASE_URL` to the Neon
connection string and `FRONTEND_ORIGINS` to the exact Vercel site origin in
Render's environment settings. Render generates `JWT_SECRET` automatically.
Never commit database connection strings or JWT secrets.

The backend still supports the existing local SQL Server setup. Local
development defaults to Windows authentication; use the PostgreSQL mode only
for the hosted service or when intentionally connecting to the migrated
database:

```text
DB_AUTH_MODE=postgres
DATABASE_URL=<Neon connection string>
```

PostgreSQL connections require TLS and verify the database certificate.
`DB_AUTH_MODE=sql` remains available for SQL-authenticated SQL Server
connections.

## Migrating SQL Server data to Neon

The repository includes the PostgreSQL schema and a one-time migration utility
based on the actual `portfolio` schema. It copies roles, accounts (including
password hashes and role assignments), projects, skills, profiles, education,
experience, favorites, and contact messages. It preserves identity values,
primary keys, unique constraints, and foreign keys. The migration is
transactional and refuses to write into target tables that already contain
data.

1. Keep the source SQL Server available on the machine running the migration.
   In the ignored `backend/.env`, keep the local SQL Server settings and add
   `DATABASE_URL` with the Neon connection string. Make sure
   `DB_AUTH_MODE` is not set to `postgres` for this source-to-target operation.
2. Run from the `backend` directory:

   ```powershell
   npm run db:migrate:postgres
   ```

3. Wait for the script to report successful completion, then set the same
   `DATABASE_URL` as a secret in the Render service environment. Do not add it
   to source control, a frontend setting, or a public issue.
4. Deploy the Render service from the repository's `render.yaml`. Set
   `FRONTEND_ORIGINS` in Render to the exact production Vercel origin after
   the frontend project is created.

The Neon free plan and Render free web service have usage and availability
limits. Render may spin down the API after inactivity, and the first request
after that can be delayed. This setup is for a personal demo, not a
production-service availability guarantee.

The local CORS allowlist includes `http://localhost:5173` and
`http://127.0.0.1:5173` (plus the corresponding Vite preview origins). For a
deployed frontend, set `FRONTEND_ORIGINS` in the backend environment to the
exact comma-separated frontend origin(s), including scheme and host, for
example `https://your-portfolio.example`. Do not use `*`.

Set `VITE_API_URL` in the frontend build environment to the backend origin,
for example `https://api.your-portfolio.example` or `http://localhost:5000`
for a local build. It is an origin, not an API path; the frontend adds
`/auth/register`, `/auth/login`, and other endpoint paths itself. A production
build without this setting fails API calls with an explicit configuration
message rather than calling `localhost`.

For Vercel, set the project root directory to `frontend`, build command to
`npm run build`, output directory to `dist`, and define `VITE_API_URL` as the
deployed backend origin for Production and Preview environments as appropriate.
`frontend/vercel.json` routes client-side application paths back to the SPA.
The backend and a network-accessible SQL Server database must be deployed
separately; publishing the frontend alone does not make authentication or admin
API operations available.

## Granting your own account the admin role

1. Register your own account through the portfolio, then confirm it can log in
   as a normal user.
2. In a local PowerShell window on the machine with access to the target
   database, run:

   ```powershell
   cd backend
   node --env-file=.env scripts/grant-admin.js "your-account-email@example.com"
   ```

   This one-time script connects using the existing SQL Server configuration,
   finds the account by email, and changes only its `portfolio.Users.RoleId`.
   It reuses the `admin` row in `portfolio.Roles` or inserts that role if it
   does not exist. It does not create an account, set a password, change the
   JWT secret, or promote the first registrant. It fails without changing the
   account if the email is missing or ambiguous.
3. Log out and log back in so the browser receives a token for the now-admin
   account. The app verifies the user through `GET /auth/me`; its role comes
   from the database, not a browser-stored role claim.

The script uses the configured database provider and the matching
`portfolio.Users(UserId, Email, RoleId)` and
`portfolio.Roles(RoleId, RoleName)` tables. API authorization reloads the
user's current role from those tables for each authenticated request. Ordinary
users cannot grant themselves roles through registration, and hiding
dashboard navigation is not the authorization boundary.

To grant the role in the migrated Neon database, configure `DB_AUTH_MODE` as
`postgres` and `DATABASE_URL` in the ignored local `backend/.env` before
running the same command. The migration preserves the existing role
assignments, so this step is only needed if the account needs a role change.

## Admin content dashboard

After logging in with the admin account, open `/admin`. The dashboard uses
admin-protected API routes to manage the two approved featured project records,
skills and skill categories, public profile records, education, experience, and
contact messages. Project names and their verified GitHub/demo destinations
remain fixed; descriptions and optional screenshot URLs are editable. Admin
access to the dashboard and write APIs is verified by the backend on every
request. User and role management are intentionally not exposed in this
dashboard.

The existing SQL schema does not store every presentation detail: project
technology tags and assessment details, academic-project copy, and some static
portfolio text remain in the frontend. Skills, profile, education, and
experience content is loaded from the API when corresponding database records
exist; verified fallback content remains visible otherwise. No schema
migration is needed for the dashboard.
