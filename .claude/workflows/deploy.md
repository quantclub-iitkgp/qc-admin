# Deployment Workflow

## Pre-deploy Checklist

1. **Type-check and build:**
   ```bash
   pnpm build
   ```
   Fix any TypeScript or build errors before proceeding.

2. **Test locally in production mode:**
   ```bash
   pnpm start
   ```
   Visit `http://localhost:3000` and verify:
   - `/` redirects to `/login` when not authenticated
   - Login with correct `ADMIN_PASSWORD` works
   - Dashboard loads with correct counts
   - Create/Edit/Delete flows work for all entities

3. **Environment variables** — ensure these are set in production:
   - `ADMIN_PASSWORD` — a strong, unique password
   - `SESSION_SECRET` — a random string of 32+ characters

4. **Data directory** — confirm `data/` is writable in the production environment.
   The app reads/writes JSON files at runtime, so the filesystem must be writable.

5. **Deploy:**
   - Push to the hosting provider (Vercel, Railway, VPS, etc.)
   - Set env vars in the hosting dashboard

## Notes
- The admin panel should be deployed to a private/internal URL, not publicly listed
- Do not expose `data/*.json` files via a public CDN
