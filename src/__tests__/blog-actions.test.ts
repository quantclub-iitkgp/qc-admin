import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock Next.js server functions
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("next/navigation", () => ({ redirect: vi.fn() }))

// Mock data-store
const mockAddBlog = vi.fn()
const mockUpdateBlog = vi.fn()
const mockDeleteBlog = vi.fn()

vi.mock("@/lib/data-store", () => ({
  addBlog: (...args: unknown[]) => mockAddBlog(...args),
  updateBlog: (...args: unknown[]) => mockUpdateBlog(...args),
  deleteBlog: (...args: unknown[]) => mockDeleteBlog(...args),
}))

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createBlogAction, updateBlogAction, deleteBlogAction } from "@/app/(admin)/blogs/actions"

function makeFormData(fields: Record<string, string>) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.append(k, v)
  return fd
}

beforeEach(() => vi.clearAllMocks())

describe("createBlogAction", () => {
  it("calls addBlog with correct fields and redirects", async () => {
    const fd = makeFormData({
      title: "My Blog Post",
      description: "A test post",
      author: "Team QC",
      date: "2025-06-01",
      coverImage: "/img.webp",
      tags: "quant, trading",
    })

    await createBlogAction(fd)

    expect(mockAddBlog).toHaveBeenCalledOnce()
    const arg = mockAddBlog.mock.calls[0][0]
    expect(arg.title).toBe("My Blog Post")
    expect(arg.slugAsParams).toBe("my-blog-post")
    expect(arg.slug).toBe("/blogs/my-blog-post")
    expect(arg.tags).toEqual(["quant", "trading"])
    expect(revalidatePath).toHaveBeenCalledWith("/blogs")
    expect(redirect).toHaveBeenCalledWith("/blogs")
  })

  it("handles empty optional fields gracefully", async () => {
    const fd = makeFormData({ title: "Min Blog", description: "", author: "", date: "", coverImage: "", tags: "" })
    await createBlogAction(fd)
    const arg = mockAddBlog.mock.calls[0][0]
    expect(arg.tags).toEqual([])
    expect(arg.description).toBeUndefined()
  })

  it("generates slug from title with special chars", async () => {
    const fd = makeFormData({ title: "Options: A Guide!", description: "", author: "", date: "", coverImage: "", tags: "" })
    await createBlogAction(fd)
    expect(mockAddBlog.mock.calls[0][0].slugAsParams).toBe("options-a-guide")
  })
})

describe("updateBlogAction", () => {
  it("calls updateBlog with correct fields and redirects", async () => {
    const fd = makeFormData({
      title: "Updated Title",
      description: "New desc",
      author: "New Author",
      date: "2025-07-01",
      coverImage: "/new.webp",
      tags: "risk",
    })

    await updateBlogAction("old-slug", fd)

    expect(mockUpdateBlog).toHaveBeenCalledOnce()
    expect(mockUpdateBlog.mock.calls[0][0]).toBe("old-slug")
    const updates = mockUpdateBlog.mock.calls[0][1]
    expect(updates.title).toBe("Updated Title")
    expect(updates.tags).toEqual(["risk"])
    expect(revalidatePath).toHaveBeenCalledWith("/blogs")
    expect(redirect).toHaveBeenCalledWith("/blogs")
  })
})

describe("deleteBlogAction", () => {
  it("calls deleteBlog, revalidates, and returns empty object on success", async () => {
    mockDeleteBlog.mockResolvedValue(undefined)
    const result = await deleteBlogAction("my-blog")

    expect(mockDeleteBlog).toHaveBeenCalledWith("my-blog")
    expect(revalidatePath).toHaveBeenCalledWith("/blogs")
    expect(result).toEqual({})
  })

  it("returns error object if deleteBlog throws", async () => {
    mockDeleteBlog.mockRejectedValue(new Error("not found"))
    const result = await deleteBlogAction("ghost-slug")

    expect(result).toEqual({ error: "not found" })
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
