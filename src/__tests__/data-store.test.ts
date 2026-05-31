import { describe, it, expect, vi, beforeEach } from "vitest"

// data-store talks to Supabase via getServiceClient(). We mock it with a
// chainable query builder that records every call and resolves to a
// configurable { data, error }. Supabase's builder is thenable, so awaiting it
// (or its terminal .single()) yields the result — we model that with `then`.

type DbResult = { data: unknown; error: unknown }

let nextResult: DbResult = { data: null, error: null }
let calls: Array<{ table: string; method: string; args: unknown[] }> = []

interface MockBuilder {
  select: (...args: unknown[]) => MockBuilder
  insert: (...args: unknown[]) => MockBuilder
  update: (...args: unknown[]) => MockBuilder
  delete: (...args: unknown[]) => MockBuilder
  upsert: (...args: unknown[]) => MockBuilder
  eq: (...args: unknown[]) => MockBuilder
  order: (...args: unknown[]) => MockBuilder
  single: (...args: unknown[]) => MockBuilder
  then: (
    onFulfilled: (r: DbResult) => unknown,
    onRejected?: (e: unknown) => unknown
  ) => Promise<unknown>
}

function makeBuilder(table: string): MockBuilder {
  let builder: MockBuilder
  const record =
    (method: string) =>
    (...args: unknown[]): MockBuilder => {
      calls.push({ table, method, args })
      return builder
    }
  builder = {
    select: record("select"),
    insert: record("insert"),
    update: record("update"),
    delete: record("delete"),
    upsert: record("upsert"),
    eq: record("eq"),
    order: record("order"),
    single: record("single"),
    then: (onFulfilled, onRejected) => Promise.resolve(nextResult).then(onFulfilled, onRejected),
  }
  return builder
}

vi.mock("@/lib/supabase/service", () => ({
  getServiceClient: () => ({ from: (table: string) => makeBuilder(table) }),
}))

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
} from "@/lib/data-store"

function find(table: string, method: string) {
  return calls.find((c) => c.table === table && c.method === method)
}

beforeEach(() => {
  calls = []
  nextResult = { data: null, error: null }
})

// ---- Blogs ----

describe("blogs", () => {
  it("getBlogs maps snake_case rows to camelCase and orders by created_at desc", async () => {
    nextResult = {
      data: [
        {
          slug: "intro",
          slug_as_params: "intro",
          title: "Intro",
          description: "d",
          date: "2026-01-01",
          cover_image: "/c.png",
          author: "A",
          read_time: "5 min",
          tags: ["x"],
          content: "body",
        },
      ],
      error: null,
    }

    const res = await getBlogs()

    expect(res).toEqual([
      {
        slug: "intro",
        slugAsParams: "intro",
        title: "Intro",
        description: "d",
        date: "2026-01-01",
        coverImage: "/c.png",
        author: "A",
        readTime: "5 min",
        tags: ["x"],
        content: "body",
      },
    ])
    expect(find("blogs", "order")?.args).toEqual(["created_at", { ascending: false }])
  })

  it("addBlog inserts a snake_case row", async () => {
    await addBlog({ slug: "p", slugAsParams: "p", title: "P", coverImage: "/p.png", readTime: "3 min" })
    expect(find("blogs", "insert")?.args[0]).toEqual({
      slug: "p",
      slug_as_params: "p",
      title: "P",
      cover_image: "/p.png",
      read_time: "3 min",
    })
  })

  it("updateBlog updates by slug_as_params", async () => {
    await updateBlog("p", { title: "New" })
    expect(find("blogs", "update")?.args[0]).toEqual({ title: "New" })
    expect(find("blogs", "eq")?.args).toEqual(["slug_as_params", "p"])
  })

  it("deleteBlog deletes by slug_as_params", async () => {
    await deleteBlog("p")
    expect(find("blogs", "delete")).toBeDefined()
    expect(find("blogs", "eq")?.args).toEqual(["slug_as_params", "p"])
  })
})

// ---- Whitepapers ----

describe("whitepapers", () => {
  it("getWhitepapers maps image_url / published_at / pdf_url", async () => {
    nextResult = {
      data: [
        {
          id: 1,
          title: "T",
          slug: "t",
          image_url: "/i.png",
          description: null,
          content: null,
          published_at: "2026-01-01",
          pdf_url: null,
        },
      ],
      error: null,
    }

    const res = await getWhitepapers()

    expect(res).toEqual([
      {
        id: 1,
        title: "T",
        slug: "t",
        imageUrl: "/i.png",
        description: undefined,
        content: undefined,
        publishedAt: "2026-01-01",
        pdfUrl: undefined,
      },
    ])
  })

  it("addWhitepaper inserts mapped columns", async () => {
    await addWhitepaper({
      title: "T",
      slug: "t",
      imageUrl: "/i.png",
      publishedAt: "2026-01-01",
      pdfUrl: "/p.pdf",
    })
    expect(find("whitepapers", "insert")?.args[0]).toEqual({
      title: "T",
      slug: "t",
      image_url: "/i.png",
      published_at: "2026-01-01",
      pdf_url: "/p.pdf",
    })
  })

  it("updateWhitepaper updates by id", async () => {
    await updateWhitepaper(5, { title: "New", pdfUrl: "/new.pdf" })
    expect(find("whitepapers", "update")?.args[0]).toEqual({ title: "New", pdf_url: "/new.pdf" })
    expect(find("whitepapers", "eq")?.args).toEqual(["id", 5])
  })

  it("deleteWhitepaper deletes by id", async () => {
    await deleteWhitepaper(9)
    expect(find("whitepapers", "delete")).toBeDefined()
    expect(find("whitepapers", "eq")?.args).toEqual(["id", 9])
  })

  it("propagates the Supabase error", async () => {
    nextResult = { data: null, error: { message: "db down" } }
    await expect(
      addWhitepaper({ title: "X", slug: "x", imageUrl: "/x.png", publishedAt: "2026-01-01" })
    ).rejects.toThrow("db down")
  })
})

// ---- Events ----

describe("events", () => {
  it("getEvents maps rows and orders by created_at desc", async () => {
    nextResult = {
      data: [{ id: 2, title: "E", description: "d", date: "2026-02-02", image: "/e.png", link: "/l" }],
      error: null,
    }
    const res = await getEvents()
    expect(res).toEqual([
      { id: 2, title: "E", description: "d", date: "2026-02-02", image: "/e.png", link: "/l" },
    ])
    expect(find("events", "order")?.args).toEqual(["created_at", { ascending: false }])
  })

  it("addEvent inserts the row as-is", async () => {
    await addEvent({ title: "E", description: "d", date: "2026-02-02", image: "/e.png", link: "/l" })
    expect(find("events", "insert")?.args[0]).toEqual({
      title: "E",
      description: "d",
      date: "2026-02-02",
      image: "/e.png",
      link: "/l",
    })
  })

  it("updateEvent updates by id", async () => {
    await updateEvent(3, { title: "Renamed" })
    expect(find("events", "update")?.args[0]).toEqual({ title: "Renamed" })
    expect(find("events", "eq")?.args).toEqual(["id", 3])
  })

  it("deleteEvent deletes by id", async () => {
    await deleteEvent(3)
    expect(find("events", "delete")).toBeDefined()
    expect(find("events", "eq")?.args).toEqual(["id", 3])
  })
})

// ---- Team ----

describe("team", () => {
  it("getTeam maps rows and coalesces missing social fields to null", async () => {
    nextResult = {
      data: [
        { id: 4, name: "N", role: "R", image: "/n.png", bio: "b", github: null, twitter: "@n" },
      ],
      error: null,
    }
    const res = await getTeam()
    expect(res).toEqual([
      { id: 4, name: "N", role: "R", image: "/n.png", bio: "b", github: null, linkedin: null, twitter: "@n" },
    ])
  })

  it("addTeamMember inserts the row as-is", async () => {
    await addTeamMember({
      name: "N",
      role: "R",
      image: "/n.png",
      bio: "b",
      github: null,
      linkedin: null,
      twitter: null,
    })
    expect(find("team", "insert")?.args[0]).toMatchObject({ name: "N", role: "R" })
  })

  it("updateTeamMember updates by id", async () => {
    await updateTeamMember(7, { role: "Lead" })
    expect(find("team", "update")?.args[0]).toEqual({ role: "Lead" })
    expect(find("team", "eq")?.args).toEqual(["id", 7])
  })

  it("deleteTeamMember deletes by id", async () => {
    await deleteTeamMember(7)
    expect(find("team", "delete")).toBeDefined()
    expect(find("team", "eq")?.args).toEqual(["id", 7])
  })
})
