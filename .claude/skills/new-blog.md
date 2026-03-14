# New Blog Skill

When invoked, collect the following details and append a new entry to `data/blogs.json`.

## Steps

1. Ask the user for:
   - **title** (required)
   - **description** (optional — short summary)
   - **author** (optional, default: "Quant Club IIT KGP")
   - **date** in YYYY-MM-DD format (optional, default: today)
   - **tags** as a comma-separated list (optional)
   - **coverImage** path (optional, e.g. `/images/blog-cover.webp`)

2. Auto-generate `slugAsParams` from title using `transformToSlug()` logic:
   - lowercase, trim, remove special chars, spaces → hyphens

3. Build the blog object:
   ```json
   {
     "slug": "/blogs/<slugAsParams>",
     "slugAsParams": "<slugAsParams>",
     "title": "<title>",
     "description": "<description>",
     "date": "<date>",
     "coverImage": "<coverImage>",
     "author": "<author>",
     "tags": ["<tag1>", "<tag2>"]
   }
   ```

4. Prepend the object to `data/blogs.json`

5. Confirm to the user: "Blog '<title>' added with slug '<slugAsParams>'"

6. Optionally: offer to scaffold an MDX file at `../qc-frontend/src/markdown/<slugAsParams>.mdx`
