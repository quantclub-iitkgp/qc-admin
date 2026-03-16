/**
 * One-time migration script: reads all JSON data files and inserts into Supabase.
 * Run with: npx tsx scripts/seed-supabase.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment.
 */

import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import path from "path"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(url, key)
const DATA_DIR = path.join(process.cwd(), "data")

function readJSON<T>(filename: string): T[] {
  return JSON.parse(readFileSync(path.join(DATA_DIR, filename), "utf-8")) as T[]
}

async function seed() {
  // Blogs
  const blogs = readJSON<{
    slug: string
    slugAsParams: string
    title: string
    description?: string
    date?: string
    coverImage?: string
    author?: string
    tags?: string[]
    content?: string
  }>("blogs.json")

  if (blogs.length) {
    const { error } = await supabase.from("blogs").insert(
      blogs.map((b) => ({
        slug: b.slug,
        slug_as_params: b.slugAsParams,
        title: b.title,
        description: b.description ?? null,
        date: b.date ?? null,
        cover_image: b.coverImage ?? null,
        author: b.author ?? null,
        tags: b.tags ?? null,
        content: b.content ?? null,
      }))
    )
    if (error) console.error("blogs:", error.message)
    else console.log(`Seeded ${blogs.length} blogs`)
  }

  // Whitepapers
  const whitepapers = readJSON<{
    id: number
    title: string
    slug: string
    imageUrl: string
    description?: string
    content?: string
    publishedAt: string
    pdfUrl?: string
  }>("whitepapers.json")

  if (whitepapers.length) {
    const { error } = await supabase.from("whitepapers").insert(
      whitepapers.map((w) => ({
        title: w.title,
        slug: w.slug,
        image_url: w.imageUrl,
        description: w.description ?? null,
        content: w.content ?? null,
        published_at: w.publishedAt,
        pdf_url: w.pdfUrl ?? null,
      }))
    )
    if (error) console.error("whitepapers:", error.message)
    else console.log(`Seeded ${whitepapers.length} whitepapers`)
  }

  // Events
  const events = readJSON<{
    id: number
    title: string
    description: string
    date: string
    image: string
    link: string
  }>("events.json")

  if (events.length) {
    const { error } = await supabase.from("events").insert(
      events.map(({ id: _id, ...e }) => e)
    )
    if (error) console.error("events:", error.message)
    else console.log(`Seeded ${events.length} events`)
  }

  // Team
  const team = readJSON<{
    id: number
    name: string
    role: string
    image: string
    bio: string
    github: string | null
    linkedin: string | null
    twitter: string | null
  }>("team.json")

  if (team.length) {
    const { error } = await supabase.from("team").insert(
      team.map(({ id: _id, ...m }) => m)
    )
    if (error) console.error("team:", error.message)
    else console.log(`Seeded ${team.length} team members`)
  }

  // Contacts
  const contacts = readJSON<{
    id: string
    name: string
    email: string
    subject: string
    message: string
    receivedAt: string
  }>("contacts.json")

  if (contacts.length) {
    const { error } = await supabase.from("contacts").insert(
      contacts.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        subject: c.subject,
        message: c.message,
        received_at: c.receivedAt,
      }))
    )
    if (error) console.error("contacts:", error.message)
    else console.log(`Seeded ${contacts.length} contacts`)
  }

  console.log("Done.")
}

seed().catch(console.error)
