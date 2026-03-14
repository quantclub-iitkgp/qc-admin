# Content Update Workflow

Use this workflow when adding new content to the Quant Club website.

## Steps

1. **Add content** using the appropriate skill:
   - `/new-blog` — for a new blog post
   - `/new-event` — for a new event
   - `/add-team-member` — for a new team member

2. **Verify** the entry was added correctly:
   - Check the relevant `data/<entity>.json` file
   - Optionally run `pnpm dev` and visit the admin dashboard at `http://localhost:3000`
   - Confirm the new entry appears in the correct list page

3. **Commit the change:**
   ```bash
   git add data/<entity>.json
   git commit -m "content: add <title/name>"
   ```

4. **Push:**
   ```bash
   git push origin main
   ```

5. **Sync to qc-frontend** (if using shared JSON):
   - Copy the updated `data/<entity>.json` to the qc-frontend data path, or
   - Confirm the symlink/shared path is up to date
