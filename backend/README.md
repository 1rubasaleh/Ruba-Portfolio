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

The API waits for SQL Server and requires `JWT_SECRET` from the ignored local
`.env` file before it listens. SQL connectivity is configured locally in
`src/config/db.js`; do not commit database credentials or local connection
details.

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

## Granting your own account the admin role

1. Register your own account through the portfolio, then confirm it can log in
   as a normal user.
2. In a local PowerShell window on the machine with the configured SQL Server,
   run:

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

The database structure used by the script is the existing
`portfolio.Users(UserId, Email, RoleId)` and `portfolio.Roles(RoleId, RoleName)`
schema. No schema migration is required. API authorization reloads the user's
current role from those tables for each authenticated request. Ordinary users
cannot grant themselves roles through registration, and hiding dashboard
navigation is not the authorization boundary.

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
