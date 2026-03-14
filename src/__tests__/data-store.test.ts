import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock fs *before* importing data-store so the module picks up the mock
vi.mock("fs", () => ({
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}))

import { promises as fs } from "fs"
import {
  getBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  getWhitepapers,
  addWhitepaper,
  updateWhitepaper,
  deleteWhitepaper,
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  getTeam,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getContacts,
  addContact,
  type Blog,
  type Whitepaper,
  type Event,
  type TeamMember,
  type Contact,
} from "@/lib/data-store"

const mockRead = vi.mocked(fs.readFile)
const mockWrite = vi.mocked(fs.writeFile)

function setupRead(data: unknown) {
  mockRead.mockResolvedValue(JSON.stringify(data) as unknown as Buffer)
}

beforeEach(() => {
  vi.clearAllMocks()
  mockWrite.mockResolvedValue(undefined)
})

// ---- Blogs ----

const sampleBlog: Blog = {
  slug: "/blogs/test-blog",
  slugAsParams: "test-blog",
  title: "Test Blog",
  description: "A test",
  date: "2025-01-01",
  author: "Author",
  tags: ["test"],
}

describe("getBlogs", () => {
  it("returns parsed blog array", async () => {
    setupRead([sampleBlog])
    const result = await getBlogs()
    expect(result).toEqual([sampleBlog])
    expect(mockRead).toHaveBeenCalledOnce()
  })
})

describe("addBlog", () => {
  it("prepends new blog and writes file", async () => {
    const existing: Blog[] = [sampleBlog]
    setupRead(existing)

    const newBlog: Blog = { ...sampleBlog, slugAsParams: "new-blog", title: "New Blog" }
    await addBlog(newBlog)

    expect(mockWrite).toHaveBeenCalledOnce()
    const written = JSON.parse(mockWrite.mock.calls[0][1] as string) as Blog[]
    expect(written[0]).toEqual(newBlog)
    expect(written[1]).toEqual(sampleBlog)
  })
})

describe("updateBlog", () => {
  it("updates matching blog by slugAsParams", async () => {
    setupRead([sampleBlog])
    await updateBlog("test-blog", { title: "Updated Title" })

    const written = JSON.parse(mockWrite.mock.calls[0][1] as string) as Blog[]
    expect(written[0].title).toBe("Updated Title")
  })

  it("throws if blog not found", async () => {
    setupRead([sampleBlog])
    await expect(updateBlog("nonexistent", { title: "x" })).rejects.toThrow("Blog not found: nonexistent")
  })
})

describe("deleteBlog", () => {
  it("removes blog with matching slugAsParams", async () => {
    const extra: Blog = { ...sampleBlog, slugAsParams: "other-blog" }
    setupRead([sampleBlog, extra])

    await deleteBlog("test-blog")

    const written = JSON.parse(mockWrite.mock.calls[0][1] as string) as Blog[]
    expect(written).toHaveLength(1)
    expect(written[0].slugAsParams).toBe("other-blog")
  })

  it("writes unchanged array if slug not found", async () => {
    setupRead([sampleBlog])
    await deleteBlog("ghost")
    const written = JSON.parse(mockWrite.mock.calls[0][1] as string) as Blog[]
    expect(written).toHaveLength(1)
  })
})

// ---- Whitepapers ----

const sampleWp: Whitepaper = { id: 1, title: "WP One", slug: "wp-one", imageUrl: "/img.webp" }

describe("getWhitepapers", () => {
  it("returns parsed whitepaper array", async () => {
    setupRead([sampleWp])
    expect(await getWhitepapers()).toEqual([sampleWp])
  })
})

describe("addWhitepaper", () => {
  it("assigns max id + 1 and prepends", async () => {
    setupRead([sampleWp])
    await addWhitepaper({ title: "WP Two", slug: "wp-two", imageUrl: "/img2.webp" })
    const written = JSON.parse(mockWrite.mock.calls[0][1] as string) as Whitepaper[]
    expect(written[0].id).toBe(2)
    expect(written[0].title).toBe("WP Two")
  })

  it("assigns id 1 when list is empty", async () => {
    setupRead([])
    await addWhitepaper({ title: "First", slug: "first", imageUrl: "/img.webp" })
    const written = JSON.parse(mockWrite.mock.calls[0][1] as string) as Whitepaper[]
    expect(written[0].id).toBe(1)
  })
})

describe("updateWhitepaper", () => {
  it("updates matching whitepaper by id", async () => {
    setupRead([sampleWp])
    await updateWhitepaper(1, { title: "Updated" })
    const written = JSON.parse(mockWrite.mock.calls[0][1] as string) as Whitepaper[]
    expect(written[0].title).toBe("Updated")
  })

  it("throws if id not found", async () => {
    setupRead([sampleWp])
    await expect(updateWhitepaper(99, { title: "x" })).rejects.toThrow("Whitepaper not found: 99")
  })
})

describe("deleteWhitepaper", () => {
  it("removes whitepaper with matching id", async () => {
    const wp2: Whitepaper = { id: 2, title: "WP Two", slug: "wp-two", imageUrl: "/img.webp" }
    setupRead([sampleWp, wp2])
    await deleteWhitepaper(1)
    const written = JSON.parse(mockWrite.mock.calls[0][1] as string) as Whitepaper[]
    expect(written).toHaveLength(1)
    expect(written[0].id).toBe(2)
  })
})

// ---- Events ----

const sampleEvent: Event = {
  id: 1,
  title: "Test Event",
  description: "Desc",
  date: "2025-03-01",
  image: "https://img.jpg",
  link: "/events/test",
}

describe("getEvents", () => {
  it("returns parsed events array", async () => {
    setupRead([sampleEvent])
    expect(await getEvents()).toEqual([sampleEvent])
  })
})

describe("addEvent", () => {
  it("assigns next id and prepends event", async () => {
    setupRead([sampleEvent])
    await addEvent({ title: "New", description: "D", date: "2025-04-01", image: "", link: "" })
    const written = JSON.parse(mockWrite.mock.calls[0][1] as string) as Event[]
    expect(written[0].id).toBe(2)
    expect(written[0].title).toBe("New")
  })
})

describe("updateEvent", () => {
  it("updates matching event", async () => {
    setupRead([sampleEvent])
    await updateEvent(1, { title: "Updated Event" })
    const written = JSON.parse(mockWrite.mock.calls[0][1] as string) as Event[]
    expect(written[0].title).toBe("Updated Event")
  })

  it("throws if event not found", async () => {
    setupRead([sampleEvent])
    await expect(updateEvent(99, { title: "x" })).rejects.toThrow("Event not found: 99")
  })
})

describe("deleteEvent", () => {
  it("removes event with matching id", async () => {
    setupRead([sampleEvent])
    await deleteEvent(1)
    const written = JSON.parse(mockWrite.mock.calls[0][1] as string) as Event[]
    expect(written).toHaveLength(0)
  })
})

// ---- Team ----

const sampleMember: TeamMember = {
  id: 1,
  name: "Alice",
  role: "Dev",
  bio: "Bio",
  image: "/team/alice.jpg",
  github: null,
  linkedin: null,
  twitter: null,
}

describe("getTeam", () => {
  it("returns parsed team array", async () => {
    setupRead([sampleMember])
    expect(await getTeam()).toEqual([sampleMember])
  })
})

describe("addTeamMember", () => {
  it("assigns next id and prepends member", async () => {
    setupRead([sampleMember])
    await addTeamMember({ name: "Bob", role: "PM", bio: "", image: "", github: null, linkedin: null, twitter: null })
    const written = JSON.parse(mockWrite.mock.calls[0][1] as string) as TeamMember[]
    expect(written[0].id).toBe(2)
    expect(written[0].name).toBe("Bob")
  })
})

describe("updateTeamMember", () => {
  it("updates matching member", async () => {
    setupRead([sampleMember])
    await updateTeamMember(1, { role: "Lead Dev" })
    const written = JSON.parse(mockWrite.mock.calls[0][1] as string) as TeamMember[]
    expect(written[0].role).toBe("Lead Dev")
  })

  it("throws if member not found", async () => {
    setupRead([sampleMember])
    await expect(updateTeamMember(99, { name: "x" })).rejects.toThrow("Team member not found: 99")
  })
})

describe("deleteTeamMember", () => {
  it("removes member with matching id", async () => {
    setupRead([sampleMember])
    await deleteTeamMember(1)
    const written = JSON.parse(mockWrite.mock.calls[0][1] as string) as TeamMember[]
    expect(written).toHaveLength(0)
  })
})

// ---- Contacts ----

const sampleContact: Contact = {
  id: "abc-123",
  name: "Jane",
  email: "jane@example.com",
  subject: "Hello",
  message: "Hi there",
  receivedAt: "2025-01-01T00:00:00.000Z",
}

describe("getContacts", () => {
  it("returns parsed contacts array", async () => {
    setupRead([sampleContact])
    expect(await getContacts()).toEqual([sampleContact])
  })
})

describe("addContact", () => {
  it("generates id and receivedAt, then prepends", async () => {
    setupRead([sampleContact])
    await addContact({ name: "Bob", email: "bob@x.com", subject: "Q", message: "Hey" })
    const written = JSON.parse(mockWrite.mock.calls[0][1] as string) as Contact[]
    expect(written).toHaveLength(2)
    expect(written[0].name).toBe("Bob")
    expect(typeof written[0].id).toBe("string")
    expect(written[0].id).not.toBe("")
    expect(written[0].receivedAt).toBeTruthy()
    // Original contact preserved
    expect(written[1]).toEqual(sampleContact)
  })
})
