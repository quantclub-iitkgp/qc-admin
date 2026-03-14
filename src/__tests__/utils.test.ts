import { describe, it, expect } from "vitest"
import { cn, transformToSlug } from "@/lib/utils"

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("ignores falsy values", () => {
    expect(cn("foo", false && "bar", undefined, null, "baz")).toBe("foo baz")
  })

  it("deduplicates conflicting Tailwind classes (last wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
    expect(cn("text-sm", "text-lg")).toBe("text-lg")
  })

  it("handles conditional object syntax", () => {
    expect(cn({ "bg-red-500": true, "bg-blue-500": false })).toBe("bg-red-500")
  })

  it("returns empty string for no args", () => {
    expect(cn()).toBe("")
  })
})

describe("transformToSlug", () => {
  it("lowercases and hyphenates a title", () => {
    expect(transformToSlug("Hello World")).toBe("hello-world")
  })

  it("removes special characters", () => {
    expect(transformToSlug("Hello, World!")).toBe("hello-world")
  })

  it("collapses multiple spaces into one hyphen", () => {
    expect(transformToSlug("Hello   World")).toBe("hello-world")
  })

  it("trims leading and trailing whitespace", () => {
    expect(transformToSlug("  Hello World  ")).toBe("hello-world")
  })

  it("collapses multiple consecutive hyphens", () => {
    expect(transformToSlug("a--b")).toBe("a-b")
  })

  it("handles numbers in titles", () => {
    expect(transformToSlug("Options 101")).toBe("options-101")
  })

  it("handles already-slugified input", () => {
    expect(transformToSlug("mean-variance-optimization")).toBe("mean-variance-optimization")
  })

  it("produces empty string for fully-special-char input", () => {
    expect(transformToSlug("!@#$%")).toBe("")
  })
})
