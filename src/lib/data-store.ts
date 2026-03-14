import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

// ---- Types ----

export type Blog = {
  slug: string
  slugAsParams: string
  title: string
  description?: string
  date?: string
  coverImage?: string
  author?: string
  tags?: string[]
}

export type Whitepaper = {
  id: number
  title: string
  slug: string
  imageUrl: string
}

export type Event = {
  id: number
  title: string
  description: string
  date: string
  image: string
  link: string
}

export type TeamMember = {
  id: number
  name: string
  role: string
  image: string
  bio: string
  github: string | null
  linkedin: string | null
  twitter: string | null
}

export type Contact = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  receivedAt: string
}

// ---- Helpers ----

async function readFile<T>(filename: string): Promise<T[]> {
  const filePath = path.join(DATA_DIR, filename)
  const raw = await fs.readFile(filePath, "utf-8")
  return JSON.parse(raw) as T[]
}

async function writeFile<T>(filename: string, data: T[]): Promise<void> {
  const filePath = path.join(DATA_DIR, filename)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

// ---- Blogs ----

export async function getBlogs(): Promise<Blog[]> {
  return readFile<Blog>("blogs.json")
}

export async function addBlog(blog: Blog): Promise<void> {
  const blogs = await getBlogs()
  blogs.unshift(blog)
  await writeFile("blogs.json", blogs)
}

export async function updateBlog(slugAsParams: string, updates: Partial<Blog>): Promise<void> {
  const blogs = await getBlogs()
  const idx = blogs.findIndex((b) => b.slugAsParams === slugAsParams)
  if (idx === -1) throw new Error(`Blog not found: ${slugAsParams}`)
  blogs[idx] = { ...blogs[idx], ...updates }
  await writeFile("blogs.json", blogs)
}

export async function deleteBlog(slugAsParams: string): Promise<void> {
  const blogs = await getBlogs()
  const filtered = blogs.filter((b) => b.slugAsParams !== slugAsParams)
  await writeFile("blogs.json", filtered)
}

// ---- Whitepapers ----

export async function getWhitepapers(): Promise<Whitepaper[]> {
  return readFile<Whitepaper>("whitepapers.json")
}

export async function addWhitepaper(wp: Omit<Whitepaper, "id">): Promise<void> {
  const wps = await getWhitepapers()
  const maxId = wps.reduce((m, w) => Math.max(m, w.id), 0)
  wps.unshift({ ...wp, id: maxId + 1 })
  await writeFile("whitepapers.json", wps)
}

export async function updateWhitepaper(id: number, updates: Partial<Whitepaper>): Promise<void> {
  const wps = await getWhitepapers()
  const idx = wps.findIndex((w) => w.id === id)
  if (idx === -1) throw new Error(`Whitepaper not found: ${id}`)
  wps[idx] = { ...wps[idx], ...updates }
  await writeFile("whitepapers.json", wps)
}

export async function deleteWhitepaper(id: number): Promise<void> {
  const wps = await getWhitepapers()
  await writeFile("whitepapers.json", wps.filter((w) => w.id !== id))
}

// ---- Events ----

export async function getEvents(): Promise<Event[]> {
  return readFile<Event>("events.json")
}

export async function addEvent(event: Omit<Event, "id">): Promise<void> {
  const events = await getEvents()
  const maxId = events.reduce((m, e) => Math.max(m, e.id), 0)
  events.unshift({ ...event, id: maxId + 1 })
  await writeFile("events.json", events)
}

export async function updateEvent(id: number, updates: Partial<Event>): Promise<void> {
  const events = await getEvents()
  const idx = events.findIndex((e) => e.id === id)
  if (idx === -1) throw new Error(`Event not found: ${id}`)
  events[idx] = { ...events[idx], ...updates }
  await writeFile("events.json", events)
}

export async function deleteEvent(id: number): Promise<void> {
  const events = await getEvents()
  await writeFile("events.json", events.filter((e) => e.id !== id))
}

// ---- Team ----

export async function getTeam(): Promise<TeamMember[]> {
  return readFile<TeamMember>("team.json")
}

export async function addTeamMember(member: Omit<TeamMember, "id">): Promise<void> {
  const team = await getTeam()
  const maxId = team.reduce((m, t) => Math.max(m, t.id), 0)
  team.unshift({ ...member, id: maxId + 1 })
  await writeFile("team.json", team)
}

export async function updateTeamMember(id: number, updates: Partial<TeamMember>): Promise<void> {
  const team = await getTeam()
  const idx = team.findIndex((t) => t.id === id)
  if (idx === -1) throw new Error(`Team member not found: ${id}`)
  team[idx] = { ...team[idx], ...updates }
  await writeFile("team.json", team)
}

export async function deleteTeamMember(id: number): Promise<void> {
  const team = await getTeam()
  await writeFile("team.json", team.filter((t) => t.id !== id))
}

// ---- Contacts ----

export async function getContacts(): Promise<Contact[]> {
  return readFile<Contact>("contacts.json")
}

export async function addContact(contact: Omit<Contact, "id" | "receivedAt">): Promise<void> {
  const contacts = await getContacts()
  contacts.unshift({
    ...contact,
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
  })
  await writeFile("contacts.json", contacts)
}
