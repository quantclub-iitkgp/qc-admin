# New Event Skill

When invoked, collect the following details and append a new entry to `data/events.json`.

## Steps

1. Ask the user for:
   - **title** (required)
   - **description** (optional)
   - **date** in YYYY-MM-DD format (required)
   - **image** URL (optional — can be an Unsplash URL or local path)
   - **link** slug (optional, e.g. `/events/workshop-2025`)

2. Auto-generate the next `id` by finding `max(id) + 1` in existing entries.

3. Build the event object:
   ```json
   {
     "id": <next_id>,
     "title": "<title>",
     "description": "<description>",
     "date": "<YYYY-MM-DD>",
     "image": "<image_url>",
     "link": "<link>"
   }
   ```

4. Prepend the object to `data/events.json`

5. Confirm to the user: "Event '<title>' on <date> added with id <id>"
