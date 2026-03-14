import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("next/navigation", () => ({ redirect: vi.fn() }))

const mockAddWhitepaper = vi.fn()
const mockUpdateWhitepaper = vi.fn()
const mockDeleteWhitepaper = vi.fn()
const mockAddEvent = vi.fn()
const mockUpdateEvent = vi.fn()
const mockDeleteEvent = vi.fn()
const mockAddTeamMember = vi.fn()
const mockUpdateTeamMember = vi.fn()
const mockDeleteTeamMember = vi.fn()

vi.mock("@/lib/data-store", () => ({
  addWhitepaper: (...args: unknown[]) => mockAddWhitepaper(...args),
  updateWhitepaper: (...args: unknown[]) => mockUpdateWhitepaper(...args),
  deleteWhitepaper: (...args: unknown[]) => mockDeleteWhitepaper(...args),
  addEvent: (...args: unknown[]) => mockAddEvent(...args),
  updateEvent: (...args: unknown[]) => mockUpdateEvent(...args),
  deleteEvent: (...args: unknown[]) => mockDeleteEvent(...args),
  addTeamMember: (...args: unknown[]) => mockAddTeamMember(...args),
  updateTeamMember: (...args: unknown[]) => mockUpdateTeamMember(...args),
  deleteTeamMember: (...args: unknown[]) => mockDeleteTeamMember(...args),
}))

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  createWhitepaperAction,
  updateWhitepaperAction,
  deleteWhitepaperAction,
} from "@/app/(admin)/whitepapers/actions"
import {
  createEventAction,
  updateEventAction,
  deleteEventAction,
} from "@/app/(admin)/events/actions"
import {
  createTeamMemberAction,
  updateTeamMemberAction,
  deleteTeamMemberAction,
} from "@/app/(admin)/team/actions"

function fd(fields: Record<string, string>) {
  const f = new FormData()
  for (const [k, v] of Object.entries(fields)) f.append(k, v)
  return f
}

beforeEach(() => vi.clearAllMocks())

// ---- Whitepapers ----

describe("createWhitepaperAction", () => {
  it("calls addWhitepaper with slug derived from title", async () => {
    await createWhitepaperAction(fd({ title: "Black Scholes Model", imageUrl: "/img.webp" }))

    expect(mockAddWhitepaper).toHaveBeenCalledOnce()
    const arg = mockAddWhitepaper.mock.calls[0][0]
    expect(arg.title).toBe("Black Scholes Model")
    expect(arg.slug).toBe("black-scholes-model")
    expect(arg.imageUrl).toBe("/img.webp")
    expect(revalidatePath).toHaveBeenCalledWith("/whitepapers")
    expect(redirect).toHaveBeenCalledWith("/whitepapers")
  })

  it("uses default imageUrl when empty", async () => {
    await createWhitepaperAction(fd({ title: "Test Paper", imageUrl: "" }))
    expect(mockAddWhitepaper.mock.calls[0][0].imageUrl).toBe("/template-previews/blog.webp")
  })
})

describe("updateWhitepaperAction", () => {
  it("calls updateWhitepaper with correct id and fields", async () => {
    await updateWhitepaperAction(5, fd({ title: "New Title", imageUrl: "/new.webp" }))

    expect(mockUpdateWhitepaper).toHaveBeenCalledOnce()
    expect(mockUpdateWhitepaper.mock.calls[0][0]).toBe(5)
    expect(mockUpdateWhitepaper.mock.calls[0][1].title).toBe("New Title")
    expect(redirect).toHaveBeenCalledWith("/whitepapers")
  })
})

describe("deleteWhitepaperAction", () => {
  it("deletes and revalidates on success", async () => {
    mockDeleteWhitepaper.mockResolvedValue(undefined)
    const result = await deleteWhitepaperAction(3)
    expect(mockDeleteWhitepaper).toHaveBeenCalledWith(3)
    expect(revalidatePath).toHaveBeenCalledWith("/whitepapers")
    expect(result).toEqual({})
  })

  it("returns error on failure", async () => {
    mockDeleteWhitepaper.mockRejectedValue(new Error("gone"))
    const result = await deleteWhitepaperAction(99)
    expect(result).toEqual({ error: "gone" })
  })
})

// ---- Events ----

describe("createEventAction", () => {
  it("calls addEvent with correct fields", async () => {
    await createEventAction(fd({
      title: "Workshop 2025",
      description: "A great workshop",
      date: "2025-10-01",
      image: "https://img.jpg",
      link: "/events/workshop",
    }))

    expect(mockAddEvent).toHaveBeenCalledOnce()
    const arg = mockAddEvent.mock.calls[0][0]
    expect(arg.title).toBe("Workshop 2025")
    expect(arg.date).toBe("2025-10-01")
    expect(redirect).toHaveBeenCalledWith("/events")
  })

  it("uses empty string for missing image/link", async () => {
    await createEventAction(fd({ title: "T", description: "", date: "2025-01-01", image: "", link: "" }))
    const arg = mockAddEvent.mock.calls[0][0]
    expect(arg.image).toBe("")
    expect(arg.link).toBe("")
  })
})

describe("updateEventAction", () => {
  it("calls updateEvent with id and updated fields", async () => {
    await updateEventAction(2, fd({ title: "Updated", description: "D", date: "2025-01-01", image: "", link: "" }))
    expect(mockUpdateEvent.mock.calls[0][0]).toBe(2)
    expect(mockUpdateEvent.mock.calls[0][1].title).toBe("Updated")
    expect(redirect).toHaveBeenCalledWith("/events")
  })
})

describe("deleteEventAction", () => {
  it("deletes and revalidates", async () => {
    mockDeleteEvent.mockResolvedValue(undefined)
    expect(await deleteEventAction(1)).toEqual({})
    expect(mockDeleteEvent).toHaveBeenCalledWith(1)
  })

  it("returns error on failure", async () => {
    mockDeleteEvent.mockRejectedValue(new Error("fail"))
    expect(await deleteEventAction(1)).toEqual({ error: "fail" })
  })
})

// ---- Team ----

describe("createTeamMemberAction", () => {
  it("calls addTeamMember with nulled-out empty social links", async () => {
    await createTeamMemberAction(fd({
      name: "Alice",
      role: "Engineer",
      bio: "Bio text",
      image: "/team/alice.jpg",
      github: "https://github.com/alice",
      linkedin: "",
      twitter: "",
    }))

    expect(mockAddTeamMember).toHaveBeenCalledOnce()
    const arg = mockAddTeamMember.mock.calls[0][0]
    expect(arg.name).toBe("Alice")
    expect(arg.github).toBe("https://github.com/alice")
    expect(arg.linkedin).toBeNull()
    expect(arg.twitter).toBeNull()
    expect(redirect).toHaveBeenCalledWith("/team")
  })

  it("uses default image path when empty", async () => {
    await createTeamMemberAction(fd({ name: "Bob", role: "PM", bio: "", image: "", github: "", linkedin: "", twitter: "" }))
    expect(mockAddTeamMember.mock.calls[0][0].image).toBe("/team/placeholder.jpg")
  })
})

describe("updateTeamMemberAction", () => {
  it("calls updateTeamMember with correct id and fields", async () => {
    await updateTeamMemberAction(4, fd({ name: "Alice", role: "Lead", bio: "", image: "/img.jpg", github: "", linkedin: "https://li.com/alice", twitter: "" }))
    expect(mockUpdateTeamMember.mock.calls[0][0]).toBe(4)
    expect(mockUpdateTeamMember.mock.calls[0][1].linkedin).toBe("https://li.com/alice")
    expect(redirect).toHaveBeenCalledWith("/team")
  })
})

describe("deleteTeamMemberAction", () => {
  it("deletes and revalidates", async () => {
    mockDeleteTeamMember.mockResolvedValue(undefined)
    expect(await deleteTeamMemberAction(7)).toEqual({})
    expect(mockDeleteTeamMember).toHaveBeenCalledWith(7)
  })

  it("returns error on failure", async () => {
    mockDeleteTeamMember.mockRejectedValue(new Error("not found"))
    expect(await deleteTeamMemberAction(99)).toEqual({ error: "not found" })
  })
})
