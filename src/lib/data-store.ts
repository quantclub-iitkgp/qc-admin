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

// ---- SoQ Waitlist ----

export type SoQWaitlistEntry = {
  id: number
  name: string
  email: string
  phone: string
  createdAt: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function soqWaitlistFromRow(row: any): SoQWaitlistEntry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    createdAt: row.created_at,
  }
}

export async function getSoQWaitlist(): Promise<SoQWaitlistEntry[]> {
  const { data, error } = await getServiceClient()
    .from("soq_waitlist")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(soqWaitlistFromRow)
}

// ---- SoQ Phases ----

export type SoQPhase = {
  id: number
  slug: string
  title: string
  description?: string
  orderIndex: number
  isPublished: boolean
  createdAt: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function soqPhaseFromRow(row: any): SoQPhase {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? undefined,
    orderIndex: row.order_index,
    isPublished: row.is_published,
    createdAt: row.created_at,
  }
}

function soqPhaseToRow(phase: Partial<SoQPhase>) {
  return {
    ...(phase.slug !== undefined && { slug: phase.slug }),
    ...(phase.title !== undefined && { title: phase.title }),
    ...(phase.description !== undefined && { description: phase.description }),
    ...(phase.orderIndex !== undefined && { order_index: phase.orderIndex }),
    ...(phase.isPublished !== undefined && { is_published: phase.isPublished }),
  }
}

export async function getSoQPhases(): Promise<SoQPhase[]> {
  const { data, error } = await getServiceClient()
    .from("soq_phases")
    .select("*")
    .order("order_index", { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []).map(soqPhaseFromRow)
}

export async function getSoQPhase(id: number): Promise<SoQPhase | null> {
  const { data, error } = await getServiceClient()
    .from("soq_phases")
    .select("*")
    .eq("id", id)
    .single()
  if (error) return null
  return soqPhaseFromRow(data)
}

export async function createSoQPhase(phase: Omit<SoQPhase, "id" | "createdAt">): Promise<void> {
  const { error } = await getServiceClient().from("soq_phases").insert(soqPhaseToRow(phase))
  if (error) throw new Error(error.message)
}

export async function updateSoQPhase(id: number, updates: Partial<SoQPhase>): Promise<void> {
  const { error } = await getServiceClient()
    .from("soq_phases")
    .update(soqPhaseToRow(updates))
    .eq("id", id)
  if (error) throw new Error(error.message)
}

export async function deleteSoQPhase(id: number): Promise<void> {
  const { error } = await getServiceClient().from("soq_phases").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

// ---- SoQ Topics ----

export type SoQTopic = {
  id: number
  phaseId: number
  slug: string
  title: string
  description?: string
  orderIndex: number
  readingTimeMinutes: number
  isPublished: boolean
  createdAt: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function soqTopicFromRow(row: any): SoQTopic {
  return {
    id: row.id,
    phaseId: row.phase_id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? undefined,
    orderIndex: row.order_index,
    readingTimeMinutes: row.reading_time_minutes ?? 10,
    isPublished: row.is_published,
    createdAt: row.created_at,
  }
}

function soqTopicToRow(topic: Partial<SoQTopic>) {
  return {
    ...(topic.phaseId !== undefined && { phase_id: topic.phaseId }),
    ...(topic.slug !== undefined && { slug: topic.slug }),
    ...(topic.title !== undefined && { title: topic.title }),
    ...(topic.description !== undefined && { description: topic.description }),
    ...(topic.orderIndex !== undefined && { order_index: topic.orderIndex }),
    ...(topic.readingTimeMinutes !== undefined && { reading_time_minutes: topic.readingTimeMinutes }),
    ...(topic.isPublished !== undefined && { is_published: topic.isPublished }),
  }
}

export async function getSoQTopics(phaseId: number): Promise<SoQTopic[]> {
  const { data, error } = await getServiceClient()
    .from("soq_topics")
    .select("*")
    .eq("phase_id", phaseId)
    .order("order_index", { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []).map(soqTopicFromRow)
}

export async function getSoQTopic(id: number): Promise<SoQTopic | null> {
  const { data, error } = await getServiceClient()
    .from("soq_topics")
    .select("*")
    .eq("id", id)
    .single()
  if (error) return null
  return soqTopicFromRow(data)
}

export async function createSoQTopic(topic: Omit<SoQTopic, "id" | "createdAt">): Promise<void> {
  const { error } = await getServiceClient().from("soq_topics").insert(soqTopicToRow(topic))
  if (error) throw new Error(error.message)
}

export async function updateSoQTopic(id: number, updates: Partial<SoQTopic>): Promise<void> {
  const { error } = await getServiceClient()
    .from("soq_topics")
    .update(soqTopicToRow(updates))
    .eq("id", id)
  if (error) throw new Error(error.message)
}

export async function deleteSoQTopic(id: number): Promise<void> {
  const { error } = await getServiceClient().from("soq_topics").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

// ---- SoQ Content ----

export type SoQContent = {
  id: number
  topicId: number
  body: string
  updatedAt: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function soqContentFromRow(row: any): SoQContent {
  return {
    id: row.id,
    topicId: row.topic_id,
    body: row.body,
    updatedAt: row.updated_at,
  }
}

export async function getSoQContent(topicId: number): Promise<SoQContent | null> {
  const { data, error } = await getServiceClient()
    .from("soq_content")
    .select("*")
    .eq("topic_id", topicId)
    .single()
  if (error) return null
  return soqContentFromRow(data)
}

export async function upsertSoQContent(topicId: number, body: string): Promise<void> {
  const { error } = await getServiceClient()
    .from("soq_content")
    .upsert(
      { topic_id: topicId, body, updated_at: new Date().toISOString() },
      { onConflict: "topic_id" },
    )
  if (error) throw new Error(error.message)
}

// ---- SoQ Enrollments ----

export type SoQEnrollment = {
  id: number
  userId: string
  enrolledAt: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function soqEnrollmentFromRow(row: any): SoQEnrollment {
  return {
    id: row.id,
    userId: row.user_id,
    enrolledAt: row.enrolled_at,
  }
}

export async function getSoQEnrollments(): Promise<SoQEnrollment[]> {
  const { data, error } = await getServiceClient()
    .from("soq_enrollments")
    .select("*")
    .order("enrolled_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(soqEnrollmentFromRow)
}

export async function addSoQEnrollment(userId: string): Promise<void> {
  const { error } = await getServiceClient()
    .from("soq_enrollments")
    .insert({ user_id: userId })
  if (error) throw new Error(error.message)
}

export async function removeSoQEnrollment(id: number): Promise<void> {
  const { error } = await getServiceClient().from("soq_enrollments").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

// ---- SoQ Progress Analytics ----

export type SoQProgressAnalyticsRow = {
  userId: string
  completedCount: number
  lastActiveAt: string
}

export async function getSoQProgressAnalytics(): Promise<SoQProgressAnalyticsRow[]> {
  const { data, error } = await getServiceClient()
    .from("soq_progress")
    .select("user_id, topic_id, created_at")
  if (error) throw new Error(error.message)

  // Group by user_id in JS since Supabase JS client doesn't support GROUP BY
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const byUser = new Map<string, { count: number; lastAt: string }>()
  for (const row of (data ?? []) as any[]) {
    const existing = byUser.get(row.user_id)
    if (!existing) {
      byUser.set(row.user_id, { count: 1, lastAt: row.created_at ?? new Date(0).toISOString() })
    } else {
      existing.count += 1
      if (row.created_at && row.created_at > existing.lastAt) existing.lastAt = row.created_at
    }
  }

  return Array.from(byUser.entries()).map(([userId, { count, lastAt }]) => ({
    userId,
    completedCount: count,
    lastActiveAt: lastAt,
  }))
}
