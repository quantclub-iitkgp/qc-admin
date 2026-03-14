# Add Team Member Skill

When invoked, collect the following details and append a new entry to `data/team.json`.

## Steps

1. Ask the user for:
   - **name** (required)
   - **role** (required, e.g. "Research Lead")
   - **bio** (optional — short biography)
   - **image** path (optional, e.g. `/team/person.jpg`)
   - **github** URL (optional)
   - **linkedin** URL (optional)
   - **twitter** URL (optional)

2. Auto-generate the next `id` by finding `max(id) + 1` in existing entries.

3. Build the team member object:
   ```json
   {
     "id": <next_id>,
     "name": "<name>",
     "role": "<role>",
     "bio": "<bio>",
     "image": "<image>",
     "github": "<github_url_or_null>",
     "linkedin": "<linkedin_url_or_null>",
     "twitter": "<twitter_url_or_null>"
   }
   ```

4. Prepend the object to `data/team.json`

5. Confirm to the user: "Team member '<name>' (<role>) added with id <id>"
