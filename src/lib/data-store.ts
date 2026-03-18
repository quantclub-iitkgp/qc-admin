import { getServiceClient } from "@/lib/supabase/service"

// ---- Types ----

export type Blog = {
  slug: string
  slugAsParams: string
  title: string
  description?: string
  date?: string
  coverImage?: string
  author?: string
  readTime?: string
  tags?: string[]
  content?: string
}

export type Whitepaper = {
  id: number
  title: string
  slug: string
  imageUrl: string
  description?: string
  content?: string
  publishedAt: string
  pdfUrl?: string
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

// ---- Row mappers ----

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function blogFromRow(row: any): Blog {
  return {
    slug: row.slug,
    slugAsParams: row.slug_as_params,
    title: row.title,
    description: row.description ?? undefined,
    date: row.date ?? undefined,
    coverImage: row.cover_image ?? undefined,
    author: row.author ?? undefined,
    readTime: row.read_time ?? undefined,
    tags: row.tags ?? undefined,
    content: row.content ?? undefined,
  }
}

function blogToRow(blog: Partial<Blog>) {
  return {
    ...(blog.slug !== undefined && { slug: blog.slug }),
    ...(blog.slugAsParams !== undefined && { slug_as_params: blog.slugAsParams }),
    ...(blog.title !== undefined && { title: blog.title }),
    ...(blog.description !== undefined && { description: blog.description }),
    ...(blog.date !== undefined && { date: blog.date }),
    ...(blog.coverImage !== undefined && { cover_image: blog.coverImage }),
    ...(blog.author !== undefined && { author: blog.author }),
    ...(blog.readTime !== undefined && { read_time: blog.readTime }),
    ...(blog.tags !== undefined && { tags: blog.tags }),
    ...(blog.content !== undefined && { content: blog.content }),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function whitepaperFromRow(row: any): Whitepaper {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    imageUrl: row.image_url,
    description: row.description ?? undefined,
    content: row.content ?? undefined,
    publishedAt: row.published_at,
    pdfUrl: row.pdf_url ?? undefined,
  }
}

function whitepaperToRow(wp: Partial<Whitepaper>) {
  return {
    ...(wp.title !== undefined && { title: wp.title }),
    ...(wp.slug !== undefined && { slug: wp.slug }),
    ...(wp.imageUrl !== undefined && { image_url: wp.imageUrl }),
    ...(wp.description !== undefined && { description: wp.description }),
    ...(wp.content !== undefined && { content: wp.content }),
    ...(wp.publishedAt !== undefined && { published_at: wp.publishedAt }),
    ...(wp.pdfUrl !== undefined && { pdf_url: wp.pdfUrl }),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function eventFromRow(row: any): Event {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    image: row.image,
    link: row.link,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function teamFromRow(row: any): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    image: row.image,
    bio: row.bio,
    github: row.github ?? null,
    linkedin: row.linkedin ?? null,
    twitter: row.twitter ?? null,
  }
}

// ---- Blogs ----

export async function getBlogs(): Promise<Blog[]> {
  const { data, error } = await getServiceClient()
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(blogFromRow)
}

export async function addBlog(blog: Blog): Promise<void> {
  const { error } = await getServiceClient().from("blogs").insert(blogToRow(blog))
  if (error) throw new Error(error.message)
}

export async function updateBlog(slugAsParams: string, updates: Partial<Blog>): Promise<void> {
  const { error } = await getServiceClient()
    .from("blogs")
    .update(blogToRow(updates))
    .eq("slug_as_params", slugAsParams)
  if (error) throw new Error(error.message)
}

export async function deleteBlog(slugAsParams: string): Promise<void> {
  const { error } = await getServiceClient()
    .from("blogs")
    .delete()
    .eq("slug_as_params", slugAsParams)
  if (error) throw new Error(error.message)
}

// ---- Whitepapers ----

export async function getWhitepapers(): Promise<Whitepaper[]> {
  const { data, error } = await getServiceClient()
    .from("whitepapers")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(whitepaperFromRow)
}

export async function addWhitepaper(wp: Omit<Whitepaper, "id">): Promise<void> {
  const { error } = await getServiceClient().from("whitepapers").insert(whitepaperToRow(wp))
  if (error) throw new Error(error.message)
}

export async function updateWhitepaper(id: number, updates: Partial<Whitepaper>): Promise<void> {
  const { error } = await getServiceClient()
    .from("whitepapers")
    .update(whitepaperToRow(updates))
    .eq("id", id)
  if (error) throw new Error(error.message)
}

export async function deleteWhitepaper(id: number): Promise<void> {
  const { error } = await getServiceClient().from("whitepapers").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

// ---- Events ----

export async function getEvents(): Promise<Event[]> {
  const { data, error } = await getServiceClient()
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(eventFromRow)
}

export async function addEvent(event: Omit<Event, "id">): Promise<void> {
  const { error } = await getServiceClient().from("events").insert(event)
  if (error) throw new Error(error.message)
}

export async function updateEvent(id: number, updates: Partial<Event>): Promise<void> {
  const { error } = await getServiceClient().from("events").update(updates).eq("id", id)
  if (error) throw new Error(error.message)
}

export async function deleteEvent(id: number): Promise<void> {
  const { error } = await getServiceClient().from("events").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

// ---- Team ----

export async function getTeam(): Promise<TeamMember[]> {
  const { data, error } = await getServiceClient()
    .from("team")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(teamFromRow)
}

export async function addTeamMember(member: Omit<TeamMember, "id">): Promise<void> {
  const { error } = await getServiceClient().from("team").insert(member)
  if (error) throw new Error(error.message)
}

export async function updateTeamMember(id: number, updates: Partial<TeamMember>): Promise<void> {
  const { error } = await getServiceClient().from("team").update(updates).eq("id", id)
  if (error) throw new Error(error.message)
}

export async function deleteTeamMember(id: number): Promise<void> {
  const { error } = await getServiceClient().from("team").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

